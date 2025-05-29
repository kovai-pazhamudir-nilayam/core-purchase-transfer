exports.up = knex => {
  return knex
    .raw(`CREATE EXTENSION IF NOT EXISTS "uuid-ossp"`)
    .then(() => knex.schema.hasTable("purchase_order_line"))
    .then(exists => {
      if (!exists) {
        return knex.schema.createTable("purchase_order_line", table => {
          table
            .uuid("po_line_id")
            .notNullable()
            .primary()
            .defaultTo(knex.raw("uuid_generate_v4()"));
          table.jsonb("item");
          table.jsonb("po_quantity");
          table.jsonb("mrp");
          table.jsonb("tot");
          table.jsonb("discount");
          table.jsonb("unit_price");
          table.boolean("tax_included_in_price");
          table.string("cess_rate");
          table.string("cess_amount");
          table.string("gst_rate");
          table.string("tax_code");
          table.jsonb("taxes");
          table.float("approved_margin_pct");
          table.timestamp("created_at").defaultTo(knex.fn.now());
          table.timestamp("updated_at").defaultTo(knex.fn.now());
          table
            .uuid("purchase_order_id")
            .notNullable()
            .references("purchase_order_id")
            .inTable("purchase_order")
            .onDelete("CASCADE");
        });
      }
      return false;
    });
};

exports.down = knex => {
  return knex.schema.dropTable("purchase_order_line");
};
