const { v4: uuidv4 } = require("uuid");
const purchaseOrderRepo = require("../repository/purchaseOrder");
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

    const purchaseOrderInput = transformForPurchaseOrder({
      purchaseOrderId,
      body
    });
    const purchaseOrderLinesInput = transformForPurchaseOrderLines({
      purchaseOrderId,
      po_lines
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
