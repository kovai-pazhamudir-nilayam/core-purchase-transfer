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

  async function getGrnByFilters({ condition, logTrace }) {
    fastify.log.info({
      message: "Fetch GRN",
      logTrace
    });
    const knex = this;
    const query = knex(GRN.NAME).returning("*");

    if (condition.agn_number) {
      query.where("agn_number", condition.agn_number);
    }

    if (condition.grn_id) {
      query.where("grn_id", condition.grn_id);
    }
    if (condition.destination_site_id) {
      query.where("destination_site_id", condition.destination_site_id);
    }

    const response = await query;
    return response;
  }
  async function getGrnLine({ grn_id, logTrace }) {
    fastify.log.info({
      message: "Fetch GRN LINE",
      logTrace,
      grn_id
    });
    const knex = this;
    const query = knex(GRN_LINE.NAME)
      .whereIn(GRN_LINE.COLUMNS.GRN_ID, grn_id)
      .returning("*");

    const response = await query;
    return response;
  }

  return {
    upsertOrder,
    upsertPurchaseOrderLines,
    getGrnByIdNumber,
    deleteGrnLines,
    getGrnByFilters,
    getGrnLine
  };
}

module.exports = purchaseOrderRepo;
