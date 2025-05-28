const { logQuery } = require("../../commons/helpers");
const { PURCHASE_ORDER, PURCHASE_LINE } = require("../commons/constants");

function purchaseOrderRepo(fastify) {
  async function upsertOrder({ input, logTrace }) {
    const knex = this;
    const query = knex(PURCHASE_ORDER.NAME)
      .insert(input)
      .onConflict(PURCHASE_ORDER.COLUMNS.PURCHASE_ORDER_ID) // upsert by primary key
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

  async function fetchPurchaseOrderByFilters({ condition, logTrace }) {
    fastify.log.info({
      message: "Fetch Purcase Order",
      logTrace
    });
    const knex = this;
    const query = knex(PURCHASE_ORDER.NAME).returning("*");

    if (condition.po_number) {
      query.where("po_number", condition.po_number);
    }
    if (condition.grn_restrictions) {
      query.where("grn_restrictions", condition.grn_restrictions);
    }
    if (condition.destination_site_id) {
      query.where("destination_site_id", condition.destination_site_id);
    }

    const response = await query;
    return response;
  }

  async function fetchPurchaseOrderLine({ purchase_order_id, logTrace }) {
    fastify.log.info({
      message: "Fetch Purchase Order Line",
      logTrace,
      purchase_order_id
    });

    const knex = this;
    const query = knex(PURCHASE_LINE.NAME)
      .whereIn(PURCHASE_LINE.COLUMNS.PURCHASE_ORDER_ID, purchase_order_id)
      .returning("*");

    const response = await query;
    return response;
  }

  async function getPurchaseOrderWithLinesByPoNumber({
    condition = {},
    logTrace
  }) {
    const knex = this;

    const query = knex("purchase_order as po")
      .join(
        "purchase_order_line as pol",
        "po.purchase_order_id",
        "pol.purchase_order_id"
      )
      .select([
        "po.purchase_order_id",
        "po.po_number",
        "po.destination_site_id",
        "po.vendor_id",
        "po.supplier_document",
        "po.supplier_address",
        "po.destination_address",
        "po.expected_delivery",
        "po.category_classification",
        "po.po_email_ids",
        "po.grn_restrictions",
        "po.created_at as po_created_at",
        "po.created_by",
        "po.po_expiry_date",
        "po.approved_at",
        "po.approved_by",

        "pol.po_line_id",
        "pol.item",
        "pol.po_quantity",
        "pol.mrp",
        "pol.tot",
        "pol.discount",
        "pol.unit_price",
        "pol.tax_included_in_price",
        "pol.cess_rate",
        "pol.cess_amount",
        "pol.gst_rate",
        "pol.tax_code",
        "pol.taxes",
        "pol.approved_margin_pct",
        "pol.created_at as pol_created_at",
        "pol.updated_at as pol_updated_at",
        "pol.purchase_order_id as pol_purchase_order_id"
      ]);

    if (condition.po_number) {
      query.where("po.po_number", condition.po_number);
    }

    logQuery({
      logger: fastify.log,
      query,
      context: "Fetch PO with lines (structured)",
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
    fetchPurchaseOrderByFilters,
    fetchPurchaseOrderLine,
    getPurchaseOrderWithLinesByPoNumber
  };
}

module.exports = purchaseOrderRepo;
