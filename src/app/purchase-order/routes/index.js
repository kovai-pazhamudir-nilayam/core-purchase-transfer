const schemas = require("../schemas");
const handlers = require("../handlers");

module.exports = async fastify => {
  fastify.route({
    method: "POST",
    url: "/save",
    schema: schemas.postPurchaseOrder,
    handler: handlers.postPurchaseOrder(fastify)
  });
};
