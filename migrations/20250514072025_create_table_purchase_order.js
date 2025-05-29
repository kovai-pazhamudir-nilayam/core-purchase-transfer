exports.up = knex => {
  return knex
    .raw('CREATE EXTENSION IF NOT EXISTS "uuid-ossp"')
    .then(() => knex.schema.hasTable("purchase_order"))
    .then(exists => {
      if (!exists) {
        return knex.schema.createTable("purchase_order", table => {
          table
            .uuid("purchase_order_id")
            .primary()
            .notNullable()
            .defaultTo(knex.raw("uuid_generate_v4()"));
          table.string("po_number").notNullable();
          table.string("destination_site_id");
          // TODO : TBD
          table.string("vendor_id"); // supplier vendor_id
          table.jsonb("supplier_document");
          table.jsonb("supplier_address");
          table.jsonb("destination_address");
          table.jsonb("expected_delivery");
          table.timestamp("transaction_datetime");
          table.string("category_classification");
          table.jsonb("po_email_ids");
          table.enu("grn_restrictions", [
            "ONE_PO_ONE_GRN",
            "ONE_PO_LINE_ONE_GRN",
            "ONE_PO_MULTI_GRN"
          ]); //  "enum", //ONE_PO_ONE_GRN, ONE_PO_LINE_ONE_GRN, ONE_PO_MULTI_GRN
          table
            .timestamp("created_at", { useTz: true })
            .notNullable()
            .defaultTo(knex.fn.now()); // datetime
          table.uuid("created_by"); // uuid
          table
            .timestamp("approved_at", { useTz: true })
            .defaultTo(knex.fn.now()); // datetime
          table.uuid("approved_by"); // uuid
          table.timestamp("po_expiry_date", { useTz: true }); // date only
        });
      }
      return false;
    });
};

exports.down = knex => {
  return knex.schema.dropTable("purchase_order");
};
