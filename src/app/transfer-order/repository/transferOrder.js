const { logQuery } = require("../../commons/helpers");
const { TRANSFER_ORDER, TRANSFER_ORDER_LINE } = require("../commons/constants");

function purchaseOrderRepo(fastify) {
  async function upsertTransferOrder({ input, logTrace }) {
    const knex = this;
    const query = knex(TRANSFER_ORDER.NAME)
      .insert(input)
      .onConflict(TRANSFER_ORDER.COLUMNS.STO_NUMBER)
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

  async function getTransferOrderWithLinesByStoNumber({ condition, logTrace }) {
    const knex = this;

    const query = knex("transfer_order as t")
      .join("transfer_order_line as tol", "t.sto_number", "tol.sto_number")
      .select([
        "t.id",
        "t.sto_number",
        "t.sto_type",
        "t.sto_reason",
        "t.source_site_id",
        "t.source_document",
        "t.sto_date",
        "t.sto_amount",
        "t.created_at as t_created_at",
        "t.created_by as t_created_by",
        "t.updated_at as t_updated_at",
        "t.updated_by as t_updated_by",

        "tol.sto_line_id",
        "tol.item",
        "tol.sto_quantity",
        "tol.unit_price",
        "tol.tax_included_in_price",
        "tol.cess_rate",
        "tol.cess_amount",
        "tol.gst_rate",
        "tol.tax_code",
        "tol.taxes",
        "tol.hu_details",
        "tol.approved_margin_pct",
        "tol.created_at as tol_created_at",
        "tol.created_by as tol_created_by",
        "tol.updated_by as tol_updated_by",
        "tol.updated_at as tol_updated_at"
      ])
      .where("t.sto_number", condition.sto_number);

    logQuery({
      logger: fastify.log,
      query,
      context: "Fetch Transfer Order and Lines by sto_number",
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
    getTransferOrderWithLinesByStoNumber
  };
}

module.exports = purchaseOrderRepo;
