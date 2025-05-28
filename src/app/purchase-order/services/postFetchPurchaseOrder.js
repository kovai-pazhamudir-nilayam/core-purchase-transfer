const purchaseOrderRepo = require("../repository/purchaseOrder");
const {
  transformFetchPurchaseOrderResponse
} = require("../transform/purchaseOrder");

function postPurchaseOrderService(fastify) {
  const { getPurchaseOrderWithLinesByPoNumber } = purchaseOrderRepo(fastify);

  return async ({ body, logTrace }) => {
    fastify.log.info({
      message: "create purchase-order service",
      logTrace
    });
    const response = await getPurchaseOrderWithLinesByPoNumber.call(
      fastify.knex,
      {
        condition: body,
        logTrace
      }
    );
    return transformFetchPurchaseOrderResponse({
      response
    });
  };
}
module.exports = postPurchaseOrderService;
