const { transformCatalogDetail } = require("./catalogDetail");

function transformForGrn({ grn_number, body }) {
  const {
    supplier,
    supplier_invoice,
    invoice_adjustments,
    transaction_reference_number,
    grn_lines,
    ...rest
  } = body;
  const response = {
    grn_number,
    supplier: JSON.stringify(supplier),
    supplier_invoice: JSON.stringify(supplier_invoice),
    invoice_adjustments: JSON.stringify(invoice_adjustments),
    external_reference_number: transaction_reference_number,
    ...rest
  };
  return response;
}
function transformForGrnLines({
  body,
  ksinDetails,
  outletDetails,
  grn_number
}) {
  const { grn_lines, supplier } = body;
  const itemMap = transformCatalogDetail({ ksinDetails });

  return grn_lines.map(line => {
    const {
      item,
      grn_quantity,
      mrp,
      discount,
      unit_price,
      cess_amount,
      cess_rate,
      gst_rate,
      gst_amount,
      lot_params,
      ...rest
    } = line;
    const enrichedItem = itemMap[item?.ksin] ?? item;

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

    if (
      supplier.supplier_document.state_code !== outletDetails.address.state_code
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
      grn_number,
      item: JSON.stringify(enrichedItem),
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
