exports.up = knex => {
  return knex
    .raw(`CREATE EXTENSION IF NOT EXISTS "uuid-ossp"`)
    .then(() => knex.schema.hasTable("transaction_sequences"))
    .then(exists => {
      if (!exists) {
        return knex.schema.createTable("transaction_sequences", table => {
          table.text("type").primary();
          table.bigInteger("last_number").notNullable();
        });
      }
      return false;
    });
};

exports.down = knex => {
  return knex.schema.dropTable("transaction_sequences");
};
