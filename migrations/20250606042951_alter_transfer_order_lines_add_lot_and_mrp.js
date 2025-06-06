exports.up = knex => {
  return knex.schema.hasTable("transfer_order_line").then(exists => {
    if (exists) {
      return knex.schema.table("transfer_order_line", table => {
        table.jsonb("mrp");
        table.jsonb("lot_params");
      });
    }
    return false;
  });
};

exports.down = knex => {
  return knex.schema.hasTable("transfer_order_line").then(exists => {
    if (exists) {
      return knex.schema.table("transfer_order_line", table => {
        table.dropColumn("mrp");
        table.dropColumn("lot_params");
      });
    }
    return false;
  });
};
