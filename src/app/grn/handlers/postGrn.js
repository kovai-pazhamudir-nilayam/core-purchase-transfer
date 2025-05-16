const postGrnService = require("../services/postGrn");

function postGrnHandler(fastify) {
  const postGrn = postGrnService(fastify);
  return async (request, reply) => {
    const { body, logTrace } = request;
    const response = await postGrn({ body, logTrace });
    return reply.code(201).send(response);
  };
}

module.exports = postGrnHandler;
