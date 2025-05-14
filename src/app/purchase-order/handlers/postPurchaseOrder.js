const postPurchaseOrderService = require("../services/postPurchaseOrder");

function postPurchaseOrderHandler(fastify) {
  const postPurchaseOrder = postPurchaseOrderService(fastify);
  return async (request, reply) => {
    const { body, logTrace } = request;
    const response = await postPurchaseOrder({ body, logTrace });
    return reply.code(201).send(response);
  };
}

module.exports = postPurchaseOrderHandler;
