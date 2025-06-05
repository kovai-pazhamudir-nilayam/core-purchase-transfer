const { logQuery } = require("../../commons/helpers");
const { PURCHASE_ORDER, PURCHASE_LINE } = require("../commons/constants");

function purchaseOrderRepo(fastify) {
  async function upsertOrder({ input, logTrace }) {
    const knex = this;
    const query = knex(PURCHASE_ORDER.NAME)
      .insert(input)
      .onConflict([
        PURCHASE_ORDER.COLUMNS.DESTINATION_SITE_ID,
        PURCHASE_ORDER.COLUMNS.EXTERNAL_REFERENCE_NUMBER
      ]) // upsert by primary key
      .merge()
      .returning("*");

    logQuery({
      logger: fastify.log,
      query,
      context: "Upsert Order",
      logTrace
    });

    const response = await query;
    return response[0];
  }

  async function upsertPurchaseOrderLines({ input, logTrace }) {
    const knex = this;
    const query = knex(PURCHASE_LINE.NAME)
      .insert(input)
      .onConflict(PURCHASE_LINE.COLUMNS.PO_LINE_ID) // ['purchase_order_id', 'po_line_id']
      .merge()
      .returning("*");

    logQuery({
      logger: fastify.log,
      query,
      context: "Upsert Order Lines",
      logTrace
    });

    const response = await query;
    return response;
  }

  async function deletePurchaseOrderLines({ purchaseOrderId, logTrace }) {
    const knex = this;
    const query = knex(PURCHASE_LINE.NAME)
      .where(PURCHASE_LINE.COLUMNS.PURCHASE_ORDER_ID, purchaseOrderId)
      .del();

    logQuery({
      logger: fastify.log,
      query,
      context: "delete Order Lines",
      logTrace
    });
    const response = await query;
    return response;
  }

  async function fetchOrderWithLines({ purchaseOrderId, logTrace }) {
    const knex = this;

    const query = knex
      .select([
        `${PURCHASE_ORDER.NAME}.*`,
        knex.raw(`json_agg(${PURCHASE_LINE.NAME}.*) AS po_lines`)
      ])
      .from(PURCHASE_ORDER.NAME)
      .leftJoin(
        PURCHASE_LINE.NAME,
        `${PURCHASE_ORDER.NAME}.purchase_order_id`,
        `${PURCHASE_LINE.NAME}.purchase_order_id`
      )
      .where(`${PURCHASE_ORDER.NAME}.purchase_order_id`, purchaseOrderId)
      .groupBy(`${PURCHASE_ORDER.NAME}.purchase_order_id`);

    logQuery({
      logger: fastify.log,
      query,
      context: "Fetch Order with Lines",
      logTrace
    });

    const response = await query;
    return response[0];
  }

  async function getPurcaseOrderByPoNumber({ po_number, logTrace }) {
    const knex = this;
    const query = knex(PURCHASE_ORDER.NAME)
      .select("*")
      .where(PURCHASE_ORDER.COLUMNS.PO_NUMBER, po_number)
      .first();

    logQuery({
      logger: fastify.log,
      query,
      context: "Fetch Purchase Order by po_number",
      logTrace
    });
    const response = await query;
    return response;
  }

  async function getPurchaseOrderCondition({ condition, logTrace }) {
    const knex = this;
    const query = knex(PURCHASE_ORDER.NAME)
      .select("*")
      .where(condition)
      .first();

    logQuery({
      logger: fastify.log,
      query,
      context: "Fetch Purchase Order by condition",
      logTrace
    });
    const response = await query;
    return response;
  }

  return {
    upsertOrder,
    fetchOrderWithLines,
    upsertPurchaseOrderLines,
    getPurcaseOrderByPoNumber,
    deletePurchaseOrderLines,
    getPurchaseOrderCondition
  };
}

module.exports = purchaseOrderRepo;
