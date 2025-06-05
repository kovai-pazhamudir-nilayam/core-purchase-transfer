const GRN_RESTRICTIONS = {
  ONE_PO_ONE_GRN: "ONE_PO_ONE_GRN",
  ONE_PO_LINE_ONE_GRN: "ONE_PO_LINE_ONE_GRN",
  ONE_PO_MULTI_GRN: "ONE_PO_MULTI_GRN"
};

const PURCHASE_ORDER = {
  NAME: "purchase_order",
  COLUMNS: {
    PO_NUMBER: "po_number",
    EXTERNAL_REFERENCE_NUMBER: "external_reference_number",
    DESTINATION_SITE_ID: "destination_site_id",
    VENDOR_ID: "vendor_id",
    SUPPLIER_DOCUMENT: "supplier_document",
    SUPPLIER_ADDRESS: "supplier_address",
    DESTINATION_ADDRESS: "destination_address",
    EXPECTED_DELIVERY: "expected_delivery",
    CATEGORY_CLASSIFICATION: "category_classification",
    PO_EMAIL_IDS: "po_email_ids",
    GRN_RESTRICTIONS: "grn_restrictions",
    CREATED_AT: "created_at",
    CREATED_BY: "created_by",
    APPROVED_AT: "approved_at",
    APPROVED_BY: "approved_by",
    PO_EXPIRY_DATE: "po_expiry_date"
  }
};

const PURCHASE_LINE = {
  NAME: "purchase_order_line",
  COLUMNS: {
    PO_NUMBER: "po_number",
    PO_LINE_ID: "po_line_id",
    ITEM: "item",
    PO_QUANTITY: "po_quantity",
    MRP: "mrp",
    TOT: "tot",
    DISCOUNT: "discount",
    UNIT_PRICE: "unit_price",
    TAX_INCLUDED_IN_PRICE: "tax_included_in_price",
    TAX_CODE: "tax_code",
    TAXES: "taxes",
    APPROVED_MARGIN_PCT: "approved_margin_pct",
    CREATED_AT: "created_at",
    UPDATED_AT: "updated_at",
    PURCHASE_ORDER_ID: "purchase_order_id"
  }
};

const PURCHASE_ORDER_RETURN = {
  NAME: "purchase_order_return",
  COLUMNS: {
    PO_NUMBER: "po_number",
    DESTINATION_SITE_ID: "destination_site_id",
    SOURCE_SITE_ID: "source_site_id",
    CATEGORY_CLASSIFICATION: "category_classification",
    SOURCE_DOCUMENT_TYPE: "source_document_type",
    EXTERNAL_REFERENCE_NUMBER: "external_reference_number",
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

const PURCHASE_ORDER_RETURN_LINE = {
  NAME: "purchase_order_return_line",
  COLUMNS: {
    PO_LINE_ID: "po_line_id",
    PO_NUMBER: "po_number",
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
  RSTO: "RSTO",
  RTV: "RTV"
};

module.exports = {
  GRN_RESTRICTIONS,
  PURCHASE_ORDER,
  PURCHASE_LINE,
  SOURCE_DOCUMENT_TYPE,
  PURCHASE_ORDER_RETURN,
  PURCHASE_ORDER_RETURN_LINE
};
