const { transformCatalogDetail } = require("./catalogDetail");

function transformForStoTransferOrder({ body, stoNumber }) {
  const {
    source_document,
    destination_document,
    sto_amount,
    po_email_ids,
    sto_lines,
    transaction_reference_number,
    ...rest
  } = body;
  const response = {
    sto_number: stoNumber,
    source_document: JSON.stringify(source_document),
    destination_document: JSON.stringify(destination_document),
    sto_amount: JSON.stringify(sto_amount),
    external_reference_number: transaction_reference_number,
    ...rest
  };
  return response;
}
function transformForStoTransferOrderLines({
  body,
  ksinDetails,
  outletDetails,
  stoNumber
}) {
  const { sto_lines, source_document } = body;
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
      mrp,
      lot_params,
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
      sto_number: stoNumber,
      item: JSON.stringify(enrichedItem),
      sto_quantity: JSON.stringify(sto_quantity),
      unit_price: JSON.stringify(unit_price),
      mrp: JSON.stringify(mrp),
      lot_params: JSON.stringify(lot_params),
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
