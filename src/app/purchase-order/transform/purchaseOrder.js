const { transformCatalogDetail } = require("./catalogDetail");

function transformForPurchaseOrder({ poNumber, body, outletDetails }) {
  // const { v4: uuidv4 } = require("uuid");

  const {
    supplier: { vendor_id, supplier_document, supplier_address },
    destination_address,
    expected_delivery,
    po_email_ids,
    po_lines,
    transaction_reference_number,
    ...rest
  } = body;
  const response = {
    po_number: poNumber,
    vendor_id,
    supplier_document: JSON.stringify(supplier_document),
    supplier_address: JSON.stringify(supplier_address),
    destination_address: JSON.stringify(outletDetails.address),
    expected_delivery: JSON.stringify(expected_delivery),
    po_email_ids: JSON.stringify(po_email_ids),
    external_reference_number: transaction_reference_number,
    ...rest
  };
  return response;
}
function transformForPurchaseOrderLines({
  body,
  poNumber,
  po_lines,
  ksinDetails,
  outletDetails
}) {
  const itemMap = transformCatalogDetail({ ksinDetails });
  return po_lines.map(line => {
    const {
      item,
      po_quantity,
      mrp,
      tot,
      discount,
      unit_price,
      cess_amount,
      cess_rate,
      gst_rate,
      gst_amount,
      ...rest
    } = line;
    const enrichedItem = itemMap[item?.ksin] || item;
    const taxes = [];
    if (cess_amount && cess_rate) {
      taxes.push({
        tax_code: "CESS",
        tax_rate: cess_rate,
        tax_amount: cess_amount
      });
    }

    if (
      outletDetails.address.state_code !==
      body.supplier.supplier_document.state_code
    ) {
      taxes.push({
        tax_code: "IGST",
        tax_rate: gst_rate,
        tax_amount: gst_amount
      });
    } else {
      taxes.push({
        tax_code: "CGST",
        tax_rate: gst_rate / 2,
        tax_amount: gst_amount / 2
      });
      taxes.push({
        tax_code: "SGST",
        tax_rate: gst_rate / 2,
        tax_amount: gst_amount / 2
      });
    }
    return {
      po_number: poNumber,
      item: JSON.stringify(enrichedItem),
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
