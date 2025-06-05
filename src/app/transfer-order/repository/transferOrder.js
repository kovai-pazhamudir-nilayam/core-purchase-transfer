const { logQuery } = require("../../commons/helpers");
const { TRANSFER_ORDER, TRANSFER_ORDER_LINE } = require("../commons/constants");

function purchaseOrderRepo(fastify) {
  async function upsertTransferOrder({ input, logTrace }) {
    const knex = this;
    const query = knex(TRANSFER_ORDER.NAME)
      .insert(input)
      .onConflict([
        TRANSFER_ORDER.COLUMNS.SOURCE_SITE_ID,
        TRANSFER_ORDER.COLUMNS.EXTERNAL_REFERENCE_NUMBER
      ])
      .merge()
      .returning("*");

    logQuery({
      logger: fastify.log,
      query,
      context: "Upsert STO Transfer Order",
      logTrace
    });

    const response = await query;
    return response[0];
  }

  async function upsertTransferOrderLines({ input, logTrace }) {
    const knex = this;
    const query = knex(TRANSFER_ORDER_LINE.NAME)
      .insert(input)
      .onConflict(TRANSFER_ORDER_LINE.COLUMNS.STO_LINE_ID)
      .merge();

    logQuery({
      logger: fastify.log,
      query,
      context: "Upsert STO Transfer Order Lines",
      logTrace
    });

    const response = await query;
    return response;
  }

  async function getTransferOrderByStoNumber({ sto_number, logTrace }) {
    const knex = this;
    const query = knex(TRANSFER_ORDER.NAME)
      .select("*")
      .where(TRANSFER_ORDER.COLUMNS.STO_NUMBER, sto_number);

    logQuery({
      logger: fastify.log,
      query,
      context: "Fetch STO Transfer Order by  sto_number",
      logTrace
    });
    const response = await query;
    return response;
  }

  async function getTransferOrderByConditin({ condition, logTrace }) {
    const knex = this;
    const query = knex(TRANSFER_ORDER.NAME).select("*").where(condition);

    logQuery({
      logger: fastify.log,
      query,
      context: "Fetch STO Transfer Order by condition",
      logTrace
    });
    const response = await query;
    return response;
  }

  async function deleteStoTransferLines({ sto_number, logTrace }) {
    const knex = this;
    const query = knex(TRANSFER_ORDER_LINE.NAME)
      .where(TRANSFER_ORDER_LINE.COLUMNS.STO_NUMBER, sto_number)
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
    upsertTransferOrder,
    upsertTransferOrderLines,
    getTransferOrderByStoNumber,
    deleteStoTransferLines,
    getTransferOrderByConditin
  };
}

module.exports = purchaseOrderRepo;
