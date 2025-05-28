const { errorSchemas } = require("../../commons/schemas/errorSchemas");

const postFetchTransferOrderSchema = {
  tags: ["TRANSFER ORDER"],
  summary: "This API is to Fetch the TRANSFER ORDER Details",
  headers: { $ref: "request-headers#" },
  body: {
    type: "object",
    required: ["sto_number"],
    properties: {
      sto_number: { type: "string" },
      sto_type: { type: "string", enum: ["STO", "RSTO"] }
    }
  },
  response: {
    ...errorSchemas
  }
};

module.exports = postFetchTransferOrderSchema;
