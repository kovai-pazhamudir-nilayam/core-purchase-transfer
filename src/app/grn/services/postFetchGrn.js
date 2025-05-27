const grnRepo = require("../repository/grn");
const { transformFetchGrnResponse } = require("../transform/grn");

function postFetchGrnService(fastify) {
  const { getGrnByFilters, getGrnLine } = grnRepo(fastify);
  return async ({ body, logTrace }) => {
    fastify.log.info({
      message: "create grn-order service",
      body,
      logTrace
    });
    const grnResponse = await getGrnByFilters.call(fastify.knex, {
      condition: body,
      logTrace
    });
    const grnIds = grnResponse.map(e => e.grn_id);
    const grnLineResponse = await getGrnLine.call(fastify.knex, {
      grn_id: grnIds,
      logTrace
    });
    const combinedResponse = transformFetchGrnResponse({
      grnResponse,
      grnLineResponse
    });
    return combinedResponse;
  };
}
module.exports = postFetchGrnService;
