function transformForGrn({ body }) {
  const {
    supplier,
    supplier_invoice,
    invoice_adjustments,
    grn_lines,
    ...rest
  } = body;
  const response = {
    supplier: JSON.stringify(supplier),
    supplier_invoice: JSON.stringify(supplier_invoice),
    invoice_adjustments: JSON.stringify(invoice_adjustments),
    ...rest
  };
  return response;
}
function transformForGrnLines({ body }) {
  const { grn_lines, grn_id, agn_number } = body;
  return grn_lines.map(line => {
    const {
      item,
      grn_quantity,
      mrp,
      discount,
      unit_price,
      taxes,
      lot_params,
      ...rest
    } = line;

    return {
      grn_id,
      agn_number,
      item: JSON.stringify(item),
      grn_quantity: JSON.stringify(grn_quantity),
      mrp: JSON.stringify(mrp),
      lot_params: JSON.stringify(lot_params),
      discount: JSON.stringify(discount),
      unit_price: JSON.stringify(unit_price),
      taxes: JSON.stringify(taxes),
      ...rest
    };
  });
}

module.exports = { transformForGrn, transformForGrnLines };
