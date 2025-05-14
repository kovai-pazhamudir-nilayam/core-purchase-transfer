const headers = {
  $id: "request-headers",
  type: "object",
  required: ["x-channel-id"],
  properties: {
    Authorization: { type: "string" },
    "x-channel-id": {
      type: "string",
      default: "WEB",
      enum: ["AND", "WEB", "STORE", "IOS", "COMMAND-CENTER"],
      description: "Example values: 'APP'"
    }
  }
};

const auditSchema = {
  $id: "request-audit",
  type: "object",
  additionalProperties: false,
  properties: {
    api_version: { type: "string" },
    created_by: { type: "string" },
    created_at: { type: "string", format: "date-time" },
    updated_by: { type: "string" },
    updated_at: { type: "string", format: "date-time" }
  }
};

const customInfo = {
  $id: "request-custom-info",
  type: "array",
  items: {
    type: "object",
    additionalProperties: false,
    properties: {
      group: { type: "string" },
      id: { type: "string" },
      values: { type: "array", items: { type: "string" } },
      additional_info: { type: "object" }
    }
  }
};

const allowedChannel = {
  $id: "request-allowed-channel",
  type: "string",
  enum: ["ONLINE", "STORE", "OMNI"],
  default: "OMNI"
};

const quantity = {
  $id: "request-quantity",
  type: "object",
  required: ["quantity_number", "quantity_uom"],
  properties: {
    quantity_number: { type: "integer" },
    quantity_uom: { type: "string" }
  }
};

const phone_number = {
  $id: "request-phone-number",
  type: "object",
  required: ["country_code", "number"],
  properties: {
    country_code: { type: "string" },
    number: { type: "string" }
  }
};
const expectedDeliverySchema = {
  $id: "request-expected-delivery",
  type: "object",
  required: ["from_date", "to_date"],
  properties: {
    from_date: { type: "string", format: "date" },
    to_date: { type: "string", format: "date" }
  }
};

const amount = {
  $id: "request-amount",
  type: "object",
  required: ["currency", "cent_amount", "fraction"],
  properties: {
    currency: { type: "string" },
    cent_amount: { type: "integer" },
    fraction: { type: "integer" }
  }
};
const poIteam = {
  $id: "request-po-item",
  type: "object",
  required: [
    "ksin",
    "kpn_title",
    "legacy_id",
    "primary_image_url",
    "category_id",
    "brand_id"
  ],
  properties: {
    ksin: { type: "string" },
    kpn_title: { type: "string" },
    legacy_id: { type: "string" },
    primary_image_url: { type: "string", format: "uri" },
    category_id: { type: "string" },
    brand_id: { type: "string" }
  }
};
const poQuantitySchema = {
  $id: "request-po-quantity",
  type: "object",
  required: ["original_quantity", "approved_quantity", "quantity_uom"],
  properties: {
    original_quantity: { type: "number" },
    approved_quantity: { type: "number" },
    quantity_uom: { type: "string" }
  }
};
const poTotSchema = {
  $id: "request-tot",
  type: "object",
  required: ["tot_type", "tot_margin"],
  properties: {
    tot_type: { type: "string", enum: ["FIXED", "PERCENTAGE"] }, // example enum
    tot_margin: { type: "number" }
  }
};

const discountSchema = {
  $id: "request-po-discount",
  type: "object",
  required: ["discount_type"],
  properties: {
    discount_type: { type: "string", enum: ["AMT", "PCT"] },
    discount_amount: {
      type: "object",
      properties: {
        cent_amount: { type: "number" },
        currency: { type: "string" },
        fraction: { type: "number" }
      }
    },
    discount_pct: { type: "number" },
    discount_reason_code: { type: "string" }
  }
};

const taxSchema = {
  $id: "request-po-tax",
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
};

const supplierAddressSchema = {
  $id: "request-supplier-address",
  type: "object",
  required: [
    "address_line1",
    "address_line2",
    "city",
    "state",
    "post_code",
    "country",
    "phone_number",
    "email_id",
    "address_id",
    "country_code"
  ],
  properties: {
    address_id: { type: "string", format: "uuid" },
    address_line1: { type: "string" },
    address_line2: { type: "string" },
    address_line3: { type: "string" },
    landmark: { type: "string" },
    municipal: { type: "string" },
    city: { type: "string" },
    state_code: { type: "string" },
    state: { type: "string" },
    country_code: { type: "string" },
    country: { type: "string" },
    post_code: { type: "string" },
    email_id: { type: "string", format: "email" },
    phone_number: {
      type: "object",
      required: ["country_code", "number"],
      properties: {
        country_code: { type: "string" },
        number: { type: "string" }
      }
    }
  }
};

const destinationAddressSchema = {
  $id: "request-destination-address",
  type: "object",
  required: [
    "address_line1",
    "address_line2",
    "city",
    "state",
    "post_code",
    "country",
    "phone_number",
    "email_id",
    "address_id",
    "country_code"
  ],
  properties: {
    address_id: { type: "string", format: "uuid" },
    address_line1: { type: "string" },
    address_line2: { type: "string" },
    address_line3: { type: "string" },
    landmark: { type: "string" },
    municipal: { type: "string" },
    city: { type: "string" },
    state_code: { type: "string" },
    state: { type: "string" },
    country_code: { type: "string" },
    country: { type: "string" },
    post_code: { type: "string" },
    email_id: { type: "string", format: "email" },
    phone_number: {
      type: "object",
      required: ["country_code", "number"],
      properties: {
        country_code: { type: "string" },
        number: { type: "string" }
      }
    }
  }
};

exports.commonRequestSchemas = [
  auditSchema,
  headers,
  customInfo,
  allowedChannel,
  quantity,
  phone_number,
  amount,
  poIteam,
  poTotSchema,
  poQuantitySchema,
  discountSchema,
  supplierAddressSchema,
  taxSchema,
  destinationAddressSchema,
  expectedDeliverySchema
];
