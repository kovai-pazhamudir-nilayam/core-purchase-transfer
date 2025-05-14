const GRN_RESTRICTIONS = {
  ONE_PO_ONE_GRN: "ONE_PO_ONE_GRN",
  ONE_PO_LINE_ONE_GRN: "ONE_PO_LINE_ONE_GRN",
  ONE_PO_MULTI_GRN: "ONE_PO_MULTI_GRN"
};

const PURCHASE_ORDER = {
  NAME: "purchase_order",
  COLUMNS: {
    PURCHASE_ORDER_ID: "purchase_order_id",
    PO_NUMBER: "po_number",
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
    PURCHASE_ORDER_LINE_ID: "purchase_order_line_id",
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

module.exports = {
  GRN_RESTRICTIONS,
  PURCHASE_ORDER,
  PURCHASE_LINE
};
