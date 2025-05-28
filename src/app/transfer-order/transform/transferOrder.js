const { transformCatalogDetail } = require("./catalogDetail");

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
function transformForStoTransferOrderLines({
  body,
  ksinDetails,
  outletDetails
}) {
  const { sto_lines, source_document, sto_number } = body;
  const itemMap = transformCatalogDetail({ ksinDetails });

  return sto_lines.map(line => {
    const {
      item,
      cess_amount,
      cess_rate,
      gst_rate,
      gst_amount,
      sto_quantity,
      unit_price,
      hu_details,
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

    // const sourceOutlet = outletMap[source_site_id];
    // const destinationOutlet = outletMap[destination_site_id];

    if (source_document.state_code !== outletDetails.address.state_code) {
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
      sto_number,
      item: JSON.stringify(enrichedItem),
      sto_quantity: JSON.stringify(sto_quantity),
      unit_price: JSON.stringify(unit_price),
      taxes: JSON.stringify(taxes),
      hu_details: JSON.stringify(hu_details),
      ...rest
    };
  });
}
function transformFetchTransferOrderResponse({ response }) {
  const transferOrderMap = new Map();

  // eslint-disable-next-line no-restricted-syntax
  for (const row of response) {
    const stoNumber = row.sto_number;

    if (!transferOrderMap.has(stoNumber)) {
      transferOrderMap.set(stoNumber, {
        id: row.id,
        sto_number: row.sto_number,
        sto_type: row.sto_type,
        sto_reason: row.sto_reason,
        source_site_id: row.source_site_id,
        source_document: row.source_document,
        sto_date: row.sto_date,
        sto_amount: row.sto_amount,
        created_at: row.t_created_at,
        created_by: row.t_created_by,
        updated_at: row.t_updated_at,
        updated_by: row.t_updated_by,
        transfer_order_line: []
      });
    }

    transferOrderMap.get(stoNumber).transfer_order_line.push({
      sto_line_id: row.sto_line_id,
      item: row.item,
      sto_quantity: row.sto_quantity,
      unit_price: row.unit_price,
      tax_included_in_price: row.tax_included_in_price,
      cess_rate: row.cess_rate,
      cess_amount: row.cess_amount,
      gst_rate: row.gst_rate,
      tax_code: row.tax_code,
      taxes: row.taxes,
      hu_details: row.hu_details,
      approved_margin_pct: row.approved_margin_pct,
      created_at: row.tol_created_at,
      created_by: row.tol_created_by,
      updated_by: row.tol_updated_by,
      updated_at: row.tol_updated_at
    });
  }

  return Array.from(transferOrderMap.values());
}

module.exports = {
  transformForStoTransferOrder,
  transformForStoTransferOrderLines,
  transformFetchTransferOrderResponse
};
