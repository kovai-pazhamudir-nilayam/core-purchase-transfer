const GRN = {
  NAME: "grn",
  COLUMNS: {
    ID: "id",
    GRN_ID: "grn_id",
    AGN_NUMBER: "agn_number",
    DESTINATION_SITE_ID: "destination_site_id",
    CATEGORY_CLASSIFICATION: "category_classification",
    SOURCE_DOCUMENT_TYPE: "source_document_type",
    SOURCE_DOCUMENT_NUMBER: "source_document_number",
    SOURCE_DOCUMENT_DATE: "source_document_date",
    SUPPLIER: "supplier",
    SUPPLIER_INVOICE: "supplier_invoice",
    INVOICE_ADJUSTMENTS: "invoice_adjustments",
    GRN_REMARKS: "grn_remarks",
    IS_INVOICE_TOTAL_MISMATCHED: "is_invoice_total_mismatched",
    CREATED_AT: "created_at",
    CREATED_BY: "created_by",
    UPDATED_AT: "updated_at",
    UPDATED_BY: "updated_by"
  }
};

const GRN_LINE = {
  NAME: "grn_line",
  COLUMNS: {
    GRN_LINE_ID: "grn_line_id",
    GRN_ID: "grn_id",
    AGN_LINE_ID: "agn_line_id",
    AGN_NUMBER: "agn_number",
    ITEM: "item",
    GRN_QUANTITY: "grn_quantity",
    MRP: "mrp",
    UNIT_PRICE: "unit_price",
    DISCOUNT: "discount",
    TAX_INCLUDED_IN_PRICE: "tax_included_in_price",
    TAX_CODE: "tax_code",
    TAXES: "taxes",
    LOT_PARAMS: "lot_params",
    APPROVED_MARGIN_PCT: "approved_margin_pct",
    REALISED_MARGIN_PCT: "realised_margin_pct",
    CREATED_AT: "created_at",
    CREATED_BY: "created_by",
    UPDATED_AT: "updated_at",
    UPDATED_BY: "updated_by"
  }
};

const SOURCE_DOCUMENT_TYPE = {
  PO: "PO",
  STO: "STO",
  RSTO: "RSTO"
};

module.exports = {
  GRN,
  SOURCE_DOCUMENT_TYPE,
  GRN_LINE
};
