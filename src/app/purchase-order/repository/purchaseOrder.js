const { logQuery } = require("../../commons/helpers");
const { PURCHASE_ORDER, PURCHASE_LINE } = require("../commons/constants");

function purchaseOrderRepo(fastify) {
  async function createOrder({ input, logTrace }) {
    const knex = this;
    const query = knex(PURCHASE_ORDER.NAME).returning("*").insert(input);
    logQuery({
      logger: fastify.log,
      query,
      context: "Create Order",
      logTrace
    });
    const response = await query;
    return response[0];
  }

  async function createPurchaseOrderLines({ input, logTrace }) {
    const knex = this;
    const query = knex(PURCHASE_LINE.NAME)
      .insert(input)
      .onConflict(PURCHASE_LINE.COLUMNS.PURCHASE_ORDER_LINE_ID)
      .merge();

    logQuery({
      logger: fastify.log,
      query,
      context: "Create Order Lines",
      logTrace
    });
    const response = await query;
    return response[0];
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

  return {
    createOrder,
    fetchOrderWithLines,
    createPurchaseOrderLines
  };
}

module.exports = purchaseOrderRepo;
