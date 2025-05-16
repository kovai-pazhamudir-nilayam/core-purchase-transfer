const TRANSFER_ORDER = {
  NAME: "transfer_order",
  COLUMNS: {
    ID: "id",
    STO_NUMBER: "sto_number",
    STO_TYPE: "sto_type",
    STO_REASON: "sto_reason",
    SOURCE_SITE_ID: "source_site_id",
    SOURCE_DOCUMENT: "source_document",
    DESTINATION_SITE_ID: "destination_site_id",
    DESTINATION_DOCUMENT: "destination_document",
    STO_DATE: "sto_date",
    STO_AMOUNT: "sto_amount",
    CREATED_AT: "created_at",
    CREATED_BY: "created_by",
    UPDATED_AT: "updated_at",
    UPDATED_BY: "updated_by"
  }
};

const TRANSFER_ORDER_LINE = {
  NAME: "transfer_order_line",
  COLUMNS: {
    ID: "id",
    STO_LINE_ID: "sto_line_id",
    STO_NUMBER: "sto_number",
    ITEM: "item",
    STO_QUANTITY: "sto_quantity",
    UNIT_PRICE: "unit_price",
    TAX_INCLUDED_IN_PRICE: "tax_included_in_price",
    TAX_CODE: "tax_code",
    TAXES: "taxes",
    HU_DETAILS: "hu_details",
    APPROVED_MARGIN_PCT: "approved_margin_pct",
    CREATED_AT: "created_at",
    CREATED_BY: "created_by",
    UPDATED_AT: "updated_at",
    UPDATED_BY: "updated_by"
  }
};

module.exports = {
  TRANSFER_ORDER,
  TRANSFER_ORDER_LINE
};
