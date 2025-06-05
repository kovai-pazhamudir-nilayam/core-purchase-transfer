const { errorSchemas } = require("../../commons/schemas/errorSchemas");

const postTransferOrder = {
  tags: ["Transfer Order"],
  summary: "This API is to create a Stock Transfer Order (STO)",
  headers: { $ref: "request-headers#" },
  body: {
    type: "object",
    required: [
      // "sto_number",
      "sto_type",
      "source_site_id",
      "source_document",
      "destination_site_id",
      "transaction_reference_number",
      // "destination_document",
      "sto_date",
      "sto_amount",
      "sto_lines"
    ],
    additionalProperties: false,
    properties: {
      // sto_number: { type: "string" },
      sto_type: {
        type: "string",
        enum: ["STO", "RSTO"]
      },
      sto_reason: { type: "string" }, // Optional unless RSTO
      source_site_id: { type: "string" },
      source_document: { $ref: "request-source-document#" },
      transaction_reference_number: { type: "string" },
      destination_site_id: { type: "string" },
      // destination_document: { $ref: "request-destination-document#" },
      sto_date: { type: "string", format: "date-time" },
      sto_amount: { $ref: "request-sto-amount#" },
      sto_lines: {
        type: "array",
        items: {
          type: "object",
          required: [
            "item",
            "sto_quantity",
            "unit_price",
            "cess_rate",
            "cess_amount",
            "gst_rate",
            "gst_amount",
            "tax_included_in_price",
            "tax_code",
            // "taxes",
            "approved_margin_pct"
          ],
          properties: {
            item: { $ref: "request-po-item#" },
            sto_quantity: { $ref: "request-st-quantity#" },
            cess_rate: { type: "number" },
            cess_amount: { type: "number" },
            gst_rate: { type: "number" },
            gst_amount: { type: "number" },
            unit_price: {
              $ref: "request-amount#"
            },
            tax_included_in_price: { type: "boolean" },
            tax_code: { type: "string" },
            taxes: {
              type: "array",
              items: {
                type: "object",
                required: ["tax_type", "tax_rate", "unit_amount"],
                properties: {
                  tax_type: { type: "string" },
                  tax_rate: { type: "number" },
                  unit_amount: {
                    type: "object",
                    required: ["currency", "cent_amount", "fraction"],
                    properties: {
                      currency: { type: "string" },
                      cent_amount: { type: "string" },
                      fraction: { type: "string" }
                    }
                  }
                }
              }
            },
            // hu_details: { $ref: "request-hu-details#" },
            approved_margin_pct: { type: "number" }
          }
        }
      }
    },
    if: {
      properties: {
        sto_type: { const: "RSTO" }
      }
    },
    then: {
      required: ["sto_reason"]
    }
  },
  response: {
    201: {
      type: "object",
      properties: {
        sto_number: { type: "string" }
      }
    },
    ...errorSchemas
  }
};

module.exports = postTransferOrder;
