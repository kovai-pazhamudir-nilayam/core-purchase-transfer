exports.up = knex => {
  return knex
    .raw('CREATE EXTENSION IF NOT EXISTS "uuid-ossp"')
    .then(() => knex.schema.hasTable("grn_line"))
    .then(exists => {
      if (!exists) {
        return knex.schema.createTable("grn_line", table => {
          table
            .uuid("grn_line_id")
            .primary()
            .notNullable()
            .defaultTo(knex.raw("uuid_generate_v4()"));
          table.string("grn_id").notNullable();
          table
            .foreign("grn_id")
            .references("grn_id")
            .inTable("grn")
            .onDelete("CASCADE");
          table.string("agn_line_id");
          table.string("agn_number");
          table.string("cess_rate");
          table.string("cess_amount");
          table.string("gst_rate");
          table.jsonb("item");
          table.jsonb("grn_quantity");
          table.jsonb("mrp");
          table.jsonb("unit_price");
          table.jsonb("discount");
          table.boolean("tax_included_in_price");
          table.string("tax_code");
          table.jsonb("taxes");
          table.jsonb("lot_params");
          table.float("approved_margin_pct");
          table.float("realised_margin_pct");
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
  return knex.schema.dropTable("grn_line");
};
