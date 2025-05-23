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

module.exports = {
  transformForStoTransferOrder,
  transformForStoTransferOrderLines
};
