const { errorSchemas } = require("../../commons/schemas/errorSchemas");
const { GRN_RESTRICTIONS } = require("../commons/constants");

const postPurchaseOrder = {
  tags: ["PURCHASE_ORDER"],
  summary: "This API is to create a Purchase Order",
  headers: { $ref: "request-headers#" },
  body: {
    type: "object",
    required: [
      // "po_number",
      "destination_site_id",
      "supplier",
      // "destination_address",
      "transaction_reference_number",
      "expected_delivery",
      "po_lines",
      // "created_at",
      "created_by",
      "po_expiry_date"
    ],
    additionalProperties: false,
    properties: {
      // po_number: { type: "string" },
      destination_site_id: { type: "string" },
      transaction_reference_number: { type: "string" },
      transaction_datetime: { type: "string", format: "date" },
      supplier: {
        type: "object",
        required: ["vendor_id", "supplier_document", "supplier_address"],
        additionalProperties: false,
        properties: {
          vendor_id: { type: "string" },
          vendor_name: { type: "string" },
          supplier_document: {
            type: "object",
            required: ["state_code", "number"],
            additionalProperties: false,
            properties: {
              state_code: { type: "string" },
              number: { type: "string" }
            }
          },
          supplier_address: { $ref: "request-supplier-address#" }
        }
      },
      destination_address: { $ref: "request-destination-address#" },
      expected_delivery: { $ref: "request-expected-delivery#" },
      category_classification: { type: "string" },
      po_lines: {
        type: "array",
        items: {
          type: "object",
          required: [
            // "po_line_id",
            "item",
            "po_quantity",
            "mrp",
            "unit_price",
            "cess_rate",
            "cess_amount",
            "gst_rate",
            "gst_amount",
            "tax_included_in_price",
            // "tax_code",
            // "taxes",
            "approved_margin_pct"
          ],
          properties: {
            item: { $ref: "request-po-item#" },
            po_quantity: { $ref: "request-po-quantity#" },
            mrp: { $ref: "request-amount#" },
            tot: { $ref: "request-tot#" },
            cess_rate: { type: "number" },
            cess_amount: { type: "number" },
            gst_rate: { type: "number" },
            gst_amount: { type: "number" },
            discount: { $ref: "request-discount#" },
            unit_price: { $ref: "request-amount#" },
            tax_included_in_price: { type: "boolean" },
            tax_code: { type: "string" },
            // taxes: { $ref: "request-taxes#" },
            approved_margin_pct: { type: "number" }
          }
        }
      },
      po_email_ids: {
        type: "array",
        items: { type: "string" }
      },
      grn_restrictions: {
        type: "string",
        enum: Object.values(GRN_RESTRICTIONS)
      },
      created_at: { type: "string" },
      created_by: { type: "string" },
      approved_at: { type: "string" },
      approved_by: { type: "string" },
      po_expiry_date: { type: "string" }
    }
  },
  response: {
    201: {
      type: "object",
      properties: {
        po_number: { type: "string" }
      }
    },
    ...errorSchemas
  }
};

module.exports = postPurchaseOrder;
