const schemas = require("../schemas");
const handlers = require("../handlers");

module.exports = async fastify => {
  fastify.route({
    method: "POST",
    url: "/",
    schema: schemas.postGrn,
    handler: handlers.postGrn(fastify)
  });

  fastify.route({
    method: "POST",
    url: "/fetch",
    schema: schemas.postFetchGrn,
    handler: handlers.postFetchGrn(fastify)
  });
};
