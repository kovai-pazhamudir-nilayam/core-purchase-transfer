async function getNextTransactionNumber({ fastify, type }) {
  const { knex } = fastify;
  const PREFIX = type.toUpperCase();
  const START_NUMBER = 11000000;

  // Try to fetch the current sequence
  let row = await knex("transaction_sequences").where({ type: PREFIX }).first();

  // If not found, initialize with START_NUMBER
  if (!row) {
    await knex("transaction_sequences").insert({
      type: PREFIX,
      last_number: START_NUMBER
    });
    row = { last_number: START_NUMBER };
  }

  const nextNumber = parseInt(row.last_number, 10) + 1;

  // Update the stored last_number
  await knex("transaction_sequences")
    .where({ type: PREFIX })
    .update({ last_number: nextNumber });

  // Return the formatted transaction number
  return `${PREFIX}${nextNumber}`;
}

module.exports = { getNextTransactionNumber };
