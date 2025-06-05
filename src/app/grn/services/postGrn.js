const purchaseOrderRepo = require("../repository/grn");
const downstreamCallsRepo = require("../repository/downstreamCalls");
const { transformForGrn, transformForGrnLines } = require("../transform/grn");
const {
  getNextTransactionNumber
} = require("../../utils/GenerateTransactionSequence");

function postGrnService(fastify) {
  const { upsertGrn, upsertGrnLines, getGrnByCondition, deleteGrnLines } =
    purchaseOrderRepo(fastify);
  const { getKsinDetails, getOutletBySiteId } = downstreamCallsRepo(fastify);

  return async ({ body, logTrace }) => {
    fastify.log.info({
      message: "create grn-order service",
      logTrace
    });

    const {
      // grn_id,
      grn_lines,
      destination_site_id,
      transaction_reference_number
    } = body;

    let grn_number = null;
    const existingGrn = await getGrnByCondition.call(fastify.knex, {
      condition: {
        destination_site_id,
        external_reference_number: transaction_reference_number
      },
      logTrace
    });
    fastify.log.info({
      message: "Checking for existing GRN",
      existingGrn,
      logTrace
    });

    if (existingGrn.length) {
      fastify.log.info({
        message: "Existing GRN found true",
        existingGrn,
        logTrace
      });
      grn_number = existingGrn[0].grn_number;
      fastify.log.info({
        message: "Grn already exists, deleting existing lines",
        logTrace
      });
      await deleteGrnLines.call(fastify.knex, {
        grn_number,
        logTrace
      });
    }

    const ksins = [
      ...new Set(grn_lines.map(line => line.item?.ksin).filter(Boolean))
    ];
    const ksinDetails = await getKsinDetails({
      body: {
        catalog_version: "ONLINE",
        ksins,
        include_media: true,
        include_packlist: true
      },
      logTrace
    });
    const outletDetails = await getOutletBySiteId({
      siteId: destination_site_id,
      logTrace
    });
    // const outletMap = new Map(
    //   outletDetails.map(item => [item.outlet_id, item])
    // );

    grn_number =
      grn_number ||
      (await getNextTransactionNumber({
        fastify,
        type: "GR"
      }));

    const purchaseOrderInput = transformForGrn({
      grn_number,
      body
    });
    const purchaseOrderLinesInput = transformForGrnLines({
      body,
      ksinDetails,
      outletDetails,
      grn_number
    });

    const knexTrx = await fastify.knex.transaction();
    try {
      await Promise.all([
        upsertGrn.call(knexTrx, {
          input: purchaseOrderInput,
          logTrace
        }),
        upsertGrnLines.call(knexTrx, {
          input: purchaseOrderLinesInput,
          logTrace
        })
      ]);
      await knexTrx.commit();
      return { grn_number };
    } catch (error) {
      await knexTrx.rollback();
      throw error;
    }
  };
}
module.exports = postGrnService;
