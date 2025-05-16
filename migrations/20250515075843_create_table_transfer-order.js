exports.up = knex => {
  return knex
    .raw('CREATE EXTENSION IF NOT EXISTS "uuid-ossp"')
    .then(() => knex.schema.hasTable("transfer_order"))
    .then(exists => {
      if (!exists) {
        return knex.schema.createTable("transfer_order", table => {
          table
            .uuid("id")
            .primary()
            .notNullable()
            .defaultTo(knex.raw("uuid_generate_v4()"));

          table.string("sto_number").notNullable().unique();
          table.string("sto_type");
          table.string("sto_reason");
          table.string("source_site_id");
          table.jsonb("source_document");
          table.string("destination_site_id");
          table.jsonb("destination_document");
          table.timestamp("sto_date", { useTz: true });
          table.jsonb("sto_amount");

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
  return knex.schema.dropTable("transfer_order");
};
