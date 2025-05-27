const postFetchGrnService = require("../services/postFetchGrn");

function postFetchGrnHandler(fastify) {
  const postFetchGrn = postFetchGrnService(fastify);
  return async (request, reply) => {
    const { body, logTrace } = request;
    const response = await postFetchGrn({ body, logTrace });
    return reply.code(201).send(response);
  };
}

module.exports = postFetchGrnHandler;
