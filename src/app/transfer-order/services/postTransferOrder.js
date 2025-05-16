const transferOrderRepo = require("../repository/transferOrder");
const {
  transformForStoTransferOrder,
  transformForStoTransferOrderLines
} = require("../transform/transferOrder");

function postTransferOrderService(fastify) {
  const {
    upsertTransferOrder,
    upsertTransferOrderLines,
    getTransferOrderByStoNumber,
    deleteStoTransferLines
  } = transferOrderRepo(fastify);

  return async ({ body, logTrace }) => {
    fastify.log.info({
      message: "create sto transfer-order service",
      logTrace
    });

    const { sto_number } = body;
    const existingStoOrder = await getTransferOrderByStoNumber.call(
      fastify.knex,
      {
        sto_number,
        logTrace
      }
    );

    if (existingStoOrder) {
      await deleteStoTransferLines.call(fastify.knex, {
        sto_number,
        logTrace
      });
    }

    const purchaseOrderInput = transformForStoTransferOrder({
      body
    });
    const purchaseOrderLinesInput = transformForStoTransferOrderLines({
      body
    });

    const knexTrx = await fastify.knex.transaction();
    try {
      await Promise.all([
        upsertTransferOrder.call(knexTrx, {
          input: purchaseOrderInput,
          logTrace
        }),
        upsertTransferOrderLines.call(knexTrx, {
          input: purchaseOrderLinesInput,
          logTrace
        })
      ]);
      await knexTrx.commit();
      return { sto_number };
    } catch (error) {
      await knexTrx.rollback();
      throw error;
    }
  };
}
module.exports = postTransferOrderService;
