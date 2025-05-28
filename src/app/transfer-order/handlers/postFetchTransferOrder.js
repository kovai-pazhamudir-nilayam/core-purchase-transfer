const postFetchTransferOrderService = require("../services/postFetchTransferOrder");

function postFetchTransferOrderHandler(fastify) {
  const postFetchTransferOrder = postFetchTransferOrderService(fastify);
  return async (request, reply) => {
    const { body, logTrace } = request;
    const response = await postFetchTransferOrder({ body, logTrace });
    return reply.code(201).send(response);
  };
}

module.exports = postFetchTransferOrderHandler;
