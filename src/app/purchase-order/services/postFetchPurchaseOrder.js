const purchaseOrderRepo = require("../repository/purchaseOrder");
const {
  transformFetchPurchaseOrderResponse
} = require("../transform/purchaseOrder");

function postPurchaseOrderService(fastify) {
  const { fetchPurchaseOrderByFilters, fetchPurchaseOrderLine } =
    purchaseOrderRepo(fastify);

  return async ({ body, logTrace }) => {
    fastify.log.info({
      message: "create purchase-order service",
      logTrace
    });
    const purchaseOrderResponse = await fetchPurchaseOrderByFilters.call(
      fastify.knex,
      {
        condition: body,
        logTrace
      }
    );
    const purchaseOrderIds = purchaseOrderResponse.map(
      e => e.purchase_order_id
    );
    const purchaseOrderLineResponse = await fetchPurchaseOrderLine.call(
      fastify.knex,
      {
        purchase_order_id: purchaseOrderIds,
        logTrace
      }
    );

    return transformFetchPurchaseOrderResponse({
      purchaseOrderResponse,
      purchaseOrderLineResponse
    });
  };
}
module.exports = postPurchaseOrderService;
