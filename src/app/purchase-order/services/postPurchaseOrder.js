const { v4: uuidv4 } = require("uuid");
const purchaseOrderRepo = require("../repository/purchaseOrder");
const downstreamCallsRepo = require("../repository/downstreamCalls");
const {
  transformForPurchaseOrder,
  transformForPurchaseOrderLines
} = require("../transform/purchaseOrder");

function postPurchaseOrderService(fastify) {
  const {
    upsertOrder,
    upsertPurchaseOrderLines,
    getPurcaseOrderByPoNumber,
    deletePurchaseOrderLines
  } = purchaseOrderRepo(fastify);
  const { getKsinDetails, getOutletBySiteId } = downstreamCallsRepo(fastify);

  return async ({ body, logTrace }) => {
    fastify.log.info({
      message: "create purchase-order service",
      logTrace
    });
    let purchaseOrderId = uuidv4();

    const { po_lines, po_number } = body;
    const existingPo = await getPurcaseOrderByPoNumber.call(fastify.knex, {
      po_number,
      logTrace
    });

    if (existingPo) {
      purchaseOrderId = existingPo.purchase_order_id;
      await deletePurchaseOrderLines.call(fastify.knex, {
        purchaseOrderId,
        logTrace
      });
    }

    const ksins = [
      ...new Set(po_lines.map(line => line.item?.ksin).filter(Boolean))
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
      siteId: body.destination_site_id,
      logTrace
    });

    const purchaseOrderInput = transformForPurchaseOrder({
      purchaseOrderId,
      body,
      outletDetails
    });
    const purchaseOrderLinesInput = transformForPurchaseOrderLines({
      body,
      purchaseOrderId,
      po_lines,
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
      return { purchase_order_id: purchaseOrderId };
    } catch (error) {
      await knexTrx.rollback();
      throw error;
    }
  };
}
module.exports = postPurchaseOrderService;
