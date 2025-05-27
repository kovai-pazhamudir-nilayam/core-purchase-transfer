const { errorSchemas } = require("../../commons/schemas/errorSchemas");

const postFetchGrnSchema = {
  tags: ["GRN"],
  summary: "This API is to Fetch the GRN",
  headers: { $ref: "request-headers#" },
  body: {
    type: "object",
    properties: {
      grn_id: { type: "string" },
      agn_number: { type: "string" }
    }
  },
  response: {
    ...errorSchemas
  }
};

module.exports = postFetchGrnSchema;
