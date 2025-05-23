const purchaseOrderRepo = require("../repository/grn");
const downstreamCallsRepo = require("../repository/downstreamCalls");
const { transformForGrn, transformForGrnLines } = require("../transform/grn");

function postGrnService(fastify) {
  const {
    upsertOrder,
    upsertPurchaseOrderLines,
    getGrnByIdNumber,
    deleteGrnLines
  } = purchaseOrderRepo(fastify);
  const { getKsinDetails, getOutletBySiteId } = downstreamCallsRepo(fastify);

  return async ({ body, logTrace }) => {
    fastify.log.info({
      message: "create grn-order service",
      logTrace
    });

    const { grn_id, grn_lines, destination_site_id } = body;
    const existingGrn = await getGrnByIdNumber.call(fastify.knex, {
      grn_id,
      logTrace
    });

    if (existingGrn) {
      await deleteGrnLines.call(fastify.knex, {
        grn_id,
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

    const purchaseOrderInput = transformForGrn({
      body
    });
    const purchaseOrderLinesInput = transformForGrnLines({
      body,
      ksinDetails,
      outletDetails
    });

    const knexTrx = await fastify.knex.transaction();
    try {
      await Promise.all([
        upsertOrder.call(knexTrx, {
          input: purchaseOrderInput,
          logTrace
        }),
        upsertPurchaseOrderLines.call(knexTrx, {
          input: purchaseOrderLinesInput,
          logTrace
        })
      ]);
      await knexTrx.commit();
      return { grn_id };
    } catch (error) {
      await knexTrx.rollback();
      throw error;
    }
  };
}
module.exports = postGrnService;
