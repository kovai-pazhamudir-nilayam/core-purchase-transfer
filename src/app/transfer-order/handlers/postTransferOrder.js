const postTransferOrderService = require("../services/postTransferOrder");

function postTransferOrderHandler(fastify) {
  const postTransferOrder = postTransferOrderService(fastify);
  return async (request, reply) => {
    const { body, logTrace } = request;
    const response = await postTransferOrder({ body, logTrace });
    return reply.code(201).send(response);
  };
}

module.exports = postTransferOrderHandler;
