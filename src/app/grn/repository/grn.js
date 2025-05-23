const { logQuery } = require("../../commons/helpers");
const { GRN, GRN_LINE } = require("../commons/constants");

function purchaseOrderRepo(fastify) {
  async function upsertOrder({ input, logTrace }) {
    const knex = this;
    const query = knex(GRN.NAME)
      .insert(input)
      .onConflict(GRN.COLUMNS.GRN_ID)
      .merge()
      .returning("*");

    logQuery({
      logger: fastify.log,
      query,
      context: "Upsert GRN",
      logTrace
    });

    const response = await query;
    return response[0];
  }

  async function upsertPurchaseOrderLines({ input, logTrace }) {
    const knex = this;
    const query = knex(GRN_LINE.NAME)
      .insert(input)
      .onConflict(GRN_LINE.COLUMNS.GRN_LINE_ID)
      .merge()
      .returning("*");

    logQuery({
      logger: fastify.log,
      query,
      context: "Upsert GRN Lines",
      logTrace
    });

    const response = await query;
    return response;
  }

  async function getGrnByIdNumber({ grn_id, logTrace }) {
    const knex = this;
    const query = knex(GRN.NAME).select("*").where(GRN.COLUMNS.GRN_ID, grn_id);

    logQuery({
      logger: fastify.log,
      query,
      context: "Fetch GRN by grn_id",
      logTrace
    });
    const response = await query;
    return response;
  }

  async function deleteGrnLines({ grn_id, logTrace }) {
    const knex = this;
    const query = knex(GRN_LINE.NAME)
      .where(GRN_LINE.COLUMNS.GRN_ID, grn_id)
      .del();

    logQuery({
      logger: fastify.log,
      query,
      context: "delete Grn Lines",
      logTrace
    });
    const response = await query;
    return response;
  }

  return {
    upsertOrder,
    upsertPurchaseOrderLines,
    getGrnByIdNumber,
    deleteGrnLines
  };
}

module.exports = purchaseOrderRepo;
