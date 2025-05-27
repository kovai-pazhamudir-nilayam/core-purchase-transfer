const { errorSchemas } = require("../../commons/schemas/errorSchemas");

const postFetchPurchaseOrderSchema = {
  tags: ["PURCHASE_ORDER"],
  summary: "This API is to Fetch the PURCHASE ORDER",
  headers: { $ref: "request-headers#" },
  body: {
    type: "object",
    required: ["po_number"],
    properties: {
      destination_site_id: { type: "string" },
      po_number: { type: "string" },
      grn_restrictions: { type: "string" }
    }
  },
  response: {
    ...errorSchemas
  }
};

module.exports = postFetchPurchaseOrderSchema;
