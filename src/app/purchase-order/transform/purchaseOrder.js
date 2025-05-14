function transformForPurchaseOrder({ purchaseOrderId, body }) {
  // const { v4: uuidv4 } = require("uuid");

  const {
    supplier: { vendor_id, supplier_document, supplier_address },
    destination_address,
    expected_delivery,
    po_email_ids,
    po_lines,
    ...rest
  } = body;
  const response = {
    purchase_order_id: purchaseOrderId,
    vendor_id,
    supplier_document: JSON.stringify(supplier_document),
    supplier_address: JSON.stringify(supplier_address),
    destination_address: JSON.stringify(destination_address),
    expected_delivery: JSON.stringify(expected_delivery),
    po_email_ids: JSON.stringify(po_email_ids),
    ...rest
  };
  return response;
}
function transformForPurchaseOrderLines({ purchaseOrderId, po_lines }) {
  return po_lines.map(line => {
    const {
      item,
      po_quantity,
      mrp,
      tot,
      discount,
      unit_price,
      taxes,
      ...rest
    } = line;

    return {
      purchase_order_id: purchaseOrderId,
      item: JSON.stringify(item),
      po_quantity: JSON.stringify(po_quantity),
      mrp: JSON.stringify(mrp),
      tot: JSON.stringify(tot),
      discount: JSON.stringify(discount),
      unit_price: JSON.stringify(unit_price),
      taxes: JSON.stringify(taxes),
      ...rest
    };
  });
}

module.exports = { transformForPurchaseOrder, transformForPurchaseOrderLines };
