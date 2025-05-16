const purchaseOrderRepo = require("../repository/grn");
const { transformForGrn, transformForGrnLines } = require("../transform/grn");

function postGrnService(fastify) {
  const {
    upsertOrder,
    upsertPurchaseOrderLines,
    getGrnByIdNumber,
    deleteGrnLines
  } = purchaseOrderRepo(fastify);

  return async ({ body, logTrace }) => {
    fastify.log.info({
      message: "create grn-order service",
      logTrace
    });

    const { grn_id } = body;
    const existingGrn = await getGrnByIdNumber.call(fastify.knex, {
      grn_id,
      logTrace
    });

    if (existingGrn) {
      await deleteGrnLines.call(fastify.knex, {
        grn_id,
        logTrace
      });
    }

    const purchaseOrderInput = transformForGrn({
      body
    });
    const purchaseOrderLinesInput = transformForGrnLines({
      body
    });

    const knexTrx = await fastify.knex.transaction();
    try {
      await Promise.all([
        upsertOrder.call(knexTrx, {
          input: purchaseOrderInput,
          logTrace
        }),
        upsertPurchaseOrderLines.call(knexTrx, {
          input: purchaseOrderLinesInput,
          logTrace
        })
      ]);
      await knexTrx.commit();
      return { grn_id };
    } catch (error) {
      await knexTrx.rollback();
      throw error;
    }
  };
}
module.exports = postGrnService;
