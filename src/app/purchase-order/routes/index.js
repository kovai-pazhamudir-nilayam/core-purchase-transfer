const schemas = require("../schemas");
const handlers = require("../handlers");

module.exports = async fastify => {
  fastify.route({
    method: "POST",
    url: "/",
    schema: schemas.postPurchaseOrder,
    handler: handlers.postPurchaseOrder(fastify)
  });
  fastify.route({
    method: "POST",
    url: "/fetch",
    schema: schemas.postFetchPurchaseOrder,
    handler: handlers.postFetchPurchaseOrder(fastify)
  });
};
