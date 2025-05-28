const transferOrderRepo = require("../repository/transferOrder");
const {
  transformFetchTransferOrderResponse
} = require("../transform/transferOrder");

function postFetchTransferOrderService(fastify) {
  const { getTransferOrderWithLinesByStoNumber } = transferOrderRepo(fastify);
  return async ({ body, logTrace }) => {
    fastify.log.info({
      message: "fetch purchase-order service",
      logTrace
    });
    const response = await getTransferOrderWithLinesByStoNumber.call(
      fastify.knex,
      {
        condition: body,
        logTrace
      }
    );
    return transformFetchTransferOrderResponse({
      response
    });
  };
}
module.exports = postFetchTransferOrderService;
