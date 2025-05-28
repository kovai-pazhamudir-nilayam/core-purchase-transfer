const { transformCatalogDetail } = require("./catalogDetail");

function transformForPurchaseOrder({ purchaseOrderId, body, outletDetails }) {
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
    destination_address: JSON.stringify(outletDetails.address),
    expected_delivery: JSON.stringify(expected_delivery),
    po_email_ids: JSON.stringify(po_email_ids),
    ...rest
  };
  return response;
}
function transformForPurchaseOrderLines({
  body,
  purchaseOrderId,
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
      purchase_order_id: purchaseOrderId,
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

function transformFetchPurchaseOrderResponse({ response }) {
  const {
    purchase_order_id,
    po_number,
    destination_site_id,
    vendor_id,
    supplier_document,
    supplier_address,
    destination_address,
    expected_delivery,
    category_classification,
    po_email_ids,
    grn_restrictions,
    po_created_at,
    created_by,
    po_expiry_date,
    approved_at,
    approved_by
  } = response[0];

  const purchaseOrderLines = response.map(row => ({
    po_line_id: row.po_line_id,
    item: row.item,
    po_quantity: row.po_quantity,
    mrp: row.mrp,
    tot: row.tot,
    discount: row.discount,
    unit_price: row.unit_price,
    tax_included_in_price: row.tax_included_in_price,
    cess_rate: row.cess_rate,
    cess_amount: row.cess_amount,
    gst_rate: row.gst_rate,
    tax_code: row.tax_code,
    taxes: row.taxes,
    approved_margin_pct: row.approved_margin_pct,
    created_at: row.pol_created_at,
    updated_at: row.pol_updated_at,
    purchase_order_id: row.pol_purchase_order_id
  }));

  return {
    purchase_order_id,
    po_number,
    destination_site_id,
    vendor_id,
    supplier_document,
    supplier_address,
    destination_address,
    expected_delivery,
    category_classification,
    po_email_ids,
    grn_restrictions,
    created_at: po_created_at,
    created_by,
    po_expiry_date,
    approved_at,
    approved_by,
    purchase_order_lines: purchaseOrderLines
  };
}

module.exports = {
  transformForPurchaseOrder,
  transformForPurchaseOrderLines,
  transformFetchPurchaseOrderResponse
};
