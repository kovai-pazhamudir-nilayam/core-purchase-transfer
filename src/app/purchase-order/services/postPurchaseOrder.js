const { v4: uuidv4 } = require("uuid");
const purchaseOrderRepo = require("../repository/purchaseOrder");
const {
  transformForPurchaseOrder,
  transformForPurchaseOrderLines
} = require("../transform/purchaseOrder");

function postPurchaseOrderService(fastify) {
  const { createOrder, createPurchaseOrderLines } = purchaseOrderRepo(fastify);

  return async ({ body, logTrace }) => {
    fastify.log.info({
      message: "create purchase-order service",
      logTrace
    });

    const { po_lines } = body;
    const purchaseOrderId = uuidv4();

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
        createOrder.call(knexTrx, {
          input: purchaseOrderInput,
          logTrace
        }),
        createPurchaseOrderLines.call(knexTrx, {
          input: purchaseOrderLinesInput,
          logTrace
        })
      ]);
      await knexTrx.commit();
    } catch (error) {
      await knexTrx.rollback();
      throw error;
    }

    // return response;
  };
}
module.exports = postPurchaseOrderService;
