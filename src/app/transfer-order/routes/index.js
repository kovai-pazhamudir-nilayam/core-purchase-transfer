const schemas = require("../schemas");
const handlers = require("../handlers");

module.exports = async fastify => {
  fastify.route({
    method: "POST",
    url: "/",
    schema: schemas.postTransferOrder,
    handler: handlers.postTransferOrder(fastify)
  });

  // fastify.route({
  //   method: "POST",
  //   url: "/fetch",
  //   schema: schemas.postFetchTransferOrder,
  //   handler: handlers.postFetchTransferOrder(fastify)
  // });
};
