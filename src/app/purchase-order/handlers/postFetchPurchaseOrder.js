const postFetchPurchaseOrderService = require("../services/postFetchPurchaseOrder");

function postFetchPurchaseOrderHandler(fastify) {
  const postFetchPurchaseOrder = postFetchPurchaseOrderService(fastify);
  return async (request, reply) => {
    const { body, logTrace } = request;
    const response = await postFetchPurchaseOrder({ body, logTrace });
    return reply.code(201).send(response);
  };
}

module.exports = postFetchPurchaseOrderHandler;
