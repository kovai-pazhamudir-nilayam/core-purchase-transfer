const postPurchaseOrderReturnService = require("../services/postPurchaseOrderReturn");

function postPurchaseOrderHandler(fastify) {
  const postPurchaseOrder = postPurchaseOrderReturnService(fastify);
  return async (request, reply) => {
    const { body, logTrace } = request;
    const response = await postPurchaseOrder({ body, logTrace });
    return reply.code(201).send(response);
  };
}

module.exports = postPurchaseOrderHandler;
