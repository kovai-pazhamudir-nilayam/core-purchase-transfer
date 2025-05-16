function transformForStoTransferOrder({ body }) {
  const {
    source_document,
    destination_document,
    sto_amount,
    po_email_ids,
    sto_lines,
    ...rest
  } = body;
  const response = {
    source_document: JSON.stringify(source_document),
    destination_document: JSON.stringify(destination_document),
    sto_amount: JSON.stringify(sto_amount),
    ...rest
  };
  return response;
}
function transformForStoTransferOrderLines({ body }) {
  const { sto_lines, sto_number } = body;
  return sto_lines.map(line => {
    const { item, sto_quantity, unit_price, taxes, hu_details, ...rest } = line;

    return {
      sto_number,
      item: JSON.stringify(item),
      sto_quantity: JSON.stringify(sto_quantity),
      unit_price: JSON.stringify(unit_price),
      taxes: JSON.stringify(taxes),
      hu_details: JSON.stringify(hu_details),
      ...rest
    };
  });
}

module.exports = {
  transformForStoTransferOrder,
  transformForStoTransferOrderLines
};
