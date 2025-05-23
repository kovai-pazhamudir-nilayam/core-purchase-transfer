const { transformCatalogDetail } = require("./catalogDetail");

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
function transformForGrnLines({ body, ksinDetails, outletDetails }) {
  const { grn_lines, grn_id, agn_number, supplier } = body;
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
      grn_id,
      agn_number,
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
