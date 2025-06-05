const { logQuery } = require("../../commons/helpers");
const {
  PURCHASE_ORDER_RETURN,
  PURCHASE_ORDER_RETURN_LINE
} = require("../commons/constants");

function purchaseOrderReturnRepo(fastify) {
  async function upsertOrder({ input, logTrace }) {
    const knex = this;
    const query = knex(PURCHASE_ORDER_RETURN.NAME)
      .insert(input)
      .onConflict([
        PURCHASE_ORDER_RETURN.COLUMNS.SOURCE_SITE_ID,
        PURCHASE_ORDER_RETURN.COLUMNS.EXTERNAL_REFERENCE_NUMBER
      ]) // upsert by primary key
      .merge()
      .returning("*");

    logQuery({
      logger: fastify.log,
      query,
      context: "Upsert PO Return",
      logTrace
    });

    const response = await query;
    return response[0];
  }

  async function upsertPurchaseOrderLines({ input, logTrace }) {
    const knex = this;
    const query = knex(PURCHASE_ORDER_RETURN_LINE.NAME)
      .insert(input)
      .onConflict(PURCHASE_ORDER_RETURN_LINE.COLUMNS.PO_LINE_ID) // ['purchase_order_id', 'po_line_id']
      .merge()
      .returning("*");

    logQuery({
      logger: fastify.log,
      query,
      context: "Upsert PO return Lines",
      logTrace
    });

    const response = await query;
    return response;
  }

  async function deletePurchaseOrderLines({ purchaseOrderId, logTrace }) {
    const knex = this;
    const query = knex(PURCHASE_ORDER_RETURN_LINE.NAME)
      .where(
        PURCHASE_ORDER_RETURN_LINE.COLUMNS.PURCHASE_ORDER_ID,
        purchaseOrderId
      )
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
        `${PURCHASE_ORDER_RETURN.NAME}.*`,
        knex.raw(`json_agg(${PURCHASE_ORDER_RETURN_LINE.NAME}.*) AS po_lines`)
      ])
      .from(PURCHASE_ORDER_RETURN.NAME)
      .leftJoin(
        PURCHASE_ORDER_RETURN_LINE.NAME,
        `${PURCHASE_ORDER_RETURN.NAME}.purchase_order_id`,
        `${PURCHASE_ORDER_RETURN_LINE.NAME}.purchase_order_id`
      )
      .where(`${PURCHASE_ORDER_RETURN.NAME}.purchase_order_id`, purchaseOrderId)
      .groupBy(`${PURCHASE_ORDER_RETURN.NAME}.purchase_order_id`);

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
    const query = knex(PURCHASE_ORDER_RETURN.NAME)
      .select("*")
      .where(PURCHASE_ORDER_RETURN.COLUMNS.PO_NUMBER, po_number)
      .first();

    logQuery({
      logger: fastify.log,
      query,
      context: "Fetch Purchase Order Return by po_number",
      logTrace
    });
    const response = await query;
    return response;
  }

  async function getPurchaseOrderByCondition({ condition, logTrace }) {
    const knex = this;
    const query = knex(PURCHASE_ORDER_RETURN.NAME).select("*").where(condition);

    logQuery({
      logger: fastify.log,
      query,
      context: "Fetch Purchase Order Return by condition",
      logTrace
    });
    const response = await query;
    // console.log("response rp", response);
    return response;
  }

  return {
    upsertOrder,
    fetchOrderWithLines,
    upsertPurchaseOrderLines,
    getPurcaseOrderByPoNumber,
    deletePurchaseOrderLines,
    getPurchaseOrderByCondition
  };
}

module.exports = purchaseOrderReturnRepo;
