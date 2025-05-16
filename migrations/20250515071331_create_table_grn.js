exports.up = knex => {
  return knex
    .raw('CREATE EXTENSION IF NOT EXISTS "uuid-ossp"')
    .then(() => knex.schema.hasTable("grn"))
    .then(exists => {
      if (!exists) {
        return knex.schema.createTable("grn", table => {
          table
            .uuid("id")
            .primary()
            .notNullable()
            .defaultTo(knex.raw("uuid_generate_v4()"));

          table.uuid("grn_id").notNullable().unique(); // Unique business identifier
          table.string("agn_number").notNullable();
          table.string("destination_site_id");
          table.string("category_classification");
          table.string("source_document_type");
          table.string("source_document_number");
          table.timestamp("source_document_date", { useTz: true });

          table.jsonb("supplier");
          table.jsonb("supplier_invoice");
          table.jsonb("invoice_adjustments");
          table.string("grn_remarks");
          table.boolean("is_invoice_total_mismatched");

          table
            .timestamp("created_at", { useTz: true })
            .notNullable()
            .defaultTo(knex.fn.now());
          table.string("created_by");
          table.timestamp("updated_at", { useTz: true });
          table.string("updated_by");
        });
      }
      return false;
    });
};

exports.down = knex => {
  return knex.schema.dropTable("grn");
};
