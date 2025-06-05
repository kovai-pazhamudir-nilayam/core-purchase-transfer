exports.up = knex => {
  return knex
    .raw(`CREATE EXTENSION IF NOT EXISTS "uuid-ossp"`)
    .then(() => knex.schema.hasTable("transfer_order_line"))
    .then(exists => {
      if (!exists) {
        return knex.schema.createTable("transfer_order_line", table => {
          table
            .uuid("sto_line_id")
            .notNullable()
            .primary()
            .defaultTo(knex.raw("uuid_generate_v4()"));
          table
            .string("sto_number")
            .notNullable()
            .references("sto_number")
            .inTable("transfer_order")
            .onDelete("CASCADE");
          table.jsonb("item");
          table.jsonb("sto_quantity");
          table.jsonb("unit_price");
          table.boolean("tax_included_in_price");
          // table.string("cess_rate");
          // table.string("cess_amount");
          // table.string("gst_rate");
          table.string("tax_code");
          table.jsonb("taxes");
          table.jsonb("hu_details");
          table.float("approved_margin_pct");
          table.timestamp("created_at").defaultTo(knex.fn.now());
          table.string("created_by");
          table.timestamp("updated_at", { useTz: true });
          table.string("updated_by");
        });
      }
      return false;
    });
};

exports.down = knex => {
  return knex.schema.dropTable("transfer_order_line");
};
