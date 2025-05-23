const {
  getAuthToken
} = require("@kovai-pazhamudir-nilayam/kpn-platform-token");

function downstreamCallsRepo(fastify) {
  async function getOutletBySiteId({ siteId, logTrace }) {
    const authToken = await getAuthToken("PLATFORM");
    try {
      const response = await fastify.request({
        url: `${process.env.CORE_NETWORK_SERVICE_URI}/v1/outlets/${siteId}`,
        path: "/network/v1/outlets",
        method: "GET",
        headers: {
          authorization: authToken,
          "x-channel-id": "WEB",
          ...logTrace
        },
        downstream_system: "core-network",
        source_system: "core-purchase-transfer",
        domain: "purchase-transfer",
        functionality: "Get Outlet By Site Id"
      });

      return response;
    } catch (err) {
      return null;
    }
  }

  async function getMultipleOutletsByOutletIds({ outlets, logTrace }) {
    const authToken = await getAuthToken("PLATFORM");
    try {
      const outletIds = outlets.join(",");
      const response = await fastify.request({
        url: `${process.env.CORE_NETWORK_SERVICE_URI}/v1/outlets?outlet_ids=${outletIds}`,
        path: "/network/v1/outlets",
        method: "GET",
        headers: {
          authorization: authToken,
          "x-channel-id": "WEB",
          ...logTrace
        },
        downstream_system: "core-network",
        source_system: "core-purchase-transfer",
        domain: "purchase-transfer",
        functionality: "Get Outlet By Outlet Ids"
      });

      return response;
    } catch (err) {
      return [];
    }
  }

  async function getKsinDetails({ logTrace, body }) {
    const authToken = await getAuthToken("PLATFORM");

    const response = await fastify.request({
      url: `${process.env.CATALOG_URI}/v1/products/fetch`,
      method: "POST",
      body,
      headers: {
        authorization: authToken,
        ...logTrace
      },
      downstream_system: "core-catalog",
      source_system: "core-purchase-transfer",
      domain: "purchase-transfer",
      functionality: "get ksin details"
    });
    return response;
  }

  return {
    getOutletBySiteId,
    getMultipleOutletsByOutletIds,
    getKsinDetails
  };
}

module.exports = downstreamCallsRepo;
