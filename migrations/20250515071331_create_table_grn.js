exports.up = knex => {
  return knex
    .raw('CREATE EXTENSION IF NOT EXISTS "uuid-ossp"')
    .then(() => knex.schema.hasTable("grn"))
    .then(exists => {
      if (!exists) {
        return knex.schema.createTable("grn", table => {
          table.string("grn_number").primary().notNullable();
          table.string("agn_number").notNullable();
          table.string("destination_site_id");
          table.string("external_reference_number");
          table.string("category_classification");
          table.timestamp("transaction_datetime");
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
          table.unique(["external_reference_number", "destination_site_id"]);
        });
      }
      return false;
    });
};

exports.down = knex => {
  return knex.schema.dropTable("grn");
};
