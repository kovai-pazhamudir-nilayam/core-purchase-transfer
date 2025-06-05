const { errorSchemas } = require("../../commons/schemas/errorSchemas");
const { SOURCE_DOCUMENT_TYPE } = require("../commons/constants");

const postCreateGrn = {
  tags: ["GRN"],
  summary: "API to save a GRN",
  headers: { $ref: "request-headers#" },
  body: {
    type: "object",
    required: [
      // "grn_id",
      // "agn_number",
      "destination_site_id",
      "transaction_reference_number",
      "source_document_type",
      "source_document_number",
      "source_document_date",
      "supplier",
      "supplier_invoice",
      "grn_lines"
    ],
    additionalProperties: false,
    properties: {
      agn_number: { type: "string" },
      transaction_reference_number: { type: "string" },
      destination_site_id: { type: "string" },
      category_classification: { type: "string" },
      source_document_type: {
        type: "string",
        enum: Object.values(SOURCE_DOCUMENT_TYPE)
      },
      source_document_number: { type: "string" },
      source_document_date: { type: "string", format: "date" },
      transaction_datetime: { type: "string", format: "date-time" },
      supplier: { $ref: "request-supplier#" },
      supplier_invoice: { $ref: "request-supplier-invoice#" },
      grn_lines: {
        type: "array",
        items: {
          type: "object",
          required: [
            // "grn_line_id",
            // "agn_line_id",
            "item",
            "cess_rate",
            "cess_amount",
            "gst_rate",
            "gst_amount",
            "grn_quantity",
            "mrp",
            "unit_price",
            "tax_included_in_price",
            "tax_code"
            // "taxes"
          ],
          additionalProperties: false,
          properties: {
            // grn_line_id: { type: "string", format: "uuid" },
            // agn_line_id: { type: "string" },
            item: { $ref: "request-grn-item#" },
            grn_quantity: {
              $ref: "request-grn_quantity"
            },
            mrp: { $ref: "request-amount#" },
            unit_price: { $ref: "request-amount#" },
            discount: { $ref: "request-discount#" },
            tax_included_in_price: { type: "boolean" },
            tax_code: { type: "string" },
            cess_rate: { type: "number" },
            cess_amount: { type: "number" },
            gst_rate: { type: "number" },
            gst_amount: { type: "number" },

            // taxes: { $ref: "request-taxes#" },
            lot_params: {
              type: "array",
              items: {
                type: "object",
                required: ["name", "value"],
                properties: {
                  name: { type: "string" },
                  value: { type: "string" }
                }
              }
            },
            approved_margin_pct: { type: "number" },
            realised_margin_pct: { type: "number" }
          }
        }
      },
      invoice_adjustments: {
        type: "object",
        properties: {
          discount: { $ref: "request-discount#" },
          freight_charges: {
            type: "object",
            properties: {
              freight_charges_amount: { $ref: "request-amount#" },
              tax_included_in_price: { type: "boolean" },
              tax_code: { type: "string" }
              // taxes: { $ref: "request-taxes#" }
            }
          },
          tcs_amount: { $ref: "request-amount#" },
          roundoff_amount: { $ref: "request-amount#" }
        }
      },
      grn_remarks: { type: "string" },
      is_invoice_total_mismatched: { type: "boolean" }
    }
  },
  response: {
    201: {
      type: "object",
      properties: {
        grn_number: { type: "string" }
      }
    },
    ...errorSchemas
  }
};

module.exports = postCreateGrn;
