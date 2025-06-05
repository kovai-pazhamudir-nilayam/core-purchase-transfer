const purchaseOrderReturnRepo = require("../repository/purchaseOrderReturn");
const downstreamCallsRepo = require("../repository/downstreamCalls");
const {
  transformPurchaseOrderReturn,
  transformPurchaseOrderReturnLines
} = require("../transform/purchaseOrderReturn");
const {
  getNextTransactionNumber
} = require("../../utils/GenerateTransactionSequence");

function postPurchaseOrderReturnService(fastify) {
  const {
    upsertOrder,
    upsertPurchaseOrderLines,
    deletePurchaseOrderLines,
    getPurchaseOrderByCondition
  } = purchaseOrderReturnRepo(fastify);
  const { getKsinDetails, getOutletBySiteId } = downstreamCallsRepo(fastify);

  return async ({ body, logTrace }) => {
    fastify.log.info({
      message: "create purchase-order-return service",
      logTrace
    });
    let rp_number = null;

    const {
      rp_lines,
      //   destination_site_id,
      source_site_id,
      transaction_reference_number
    } = body;
    const existingPo = await getPurchaseOrderByCondition.call(fastify.knex, {
      condition: {
        source_site_id,
        external_reference_number: transaction_reference_number
      },
      logTrace
    });
    fastify.log.info({
      message: "Checking for existing Purchase Order Return",
      existingPo,
      logTrace
    });

    if (existingPo.length) {
      rp_number = existingPo[0].rp_number;
      await deletePurchaseOrderLines.call(fastify.knex, {
        rp_number,
        logTrace
      });
    }

    const ksins = [
      ...new Set(rp_lines.map(line => line.item?.ksin).filter(Boolean))
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
      siteId: body.source_site_id,
      logTrace
    });

    rp_number =
      rp_number ||
      (await getNextTransactionNumber({
        fastify,
        type: "RP"
      }));

    const purchaseOrderInput = transformPurchaseOrderReturn({
      rp_number,
      body
    });
    const purchaseOrderLinesInput = transformPurchaseOrderReturnLines({
      body,
      rp_number,
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
      return { rp_number };
    } catch (error) {
      await knexTrx.rollback();
      throw error;
    }
  };
}
module.exports = postPurchaseOrderReturnService;
