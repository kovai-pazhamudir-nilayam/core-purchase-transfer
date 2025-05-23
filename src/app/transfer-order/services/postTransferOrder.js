const transferOrderRepo = require("../repository/transferOrder");
const downstreamCallsRepo = require("../repository/downstreamCalls");
const {
  transformForStoTransferOrder,
  transformForStoTransferOrderLines
} = require("../transform/transferOrder");

function postTransferOrderService(fastify) {
  const {
    upsertTransferOrder,
    upsertTransferOrderLines,
    getTransferOrderByStoNumber,
    deleteStoTransferLines
  } = transferOrderRepo(fastify);
  const { getKsinDetails, getOutletBySiteId } = downstreamCallsRepo(fastify);

  return async ({ body, logTrace }) => {
    fastify.log.info({
      message: "create sto transfer-order service",
      logTrace
    });

    const { sto_number, sto_lines, destination_site_id } = body;
    const existingStoOrder = await getTransferOrderByStoNumber.call(
      fastify.knex,
      {
        sto_number,
        logTrace
      }
    );

    if (existingStoOrder) {
      await deleteStoTransferLines.call(fastify.knex, {
        sto_number,
        logTrace
      });
    }

    const ksins = [
      ...new Set(sto_lines.map(line => line.item?.ksin).filter(Boolean))
    ];
    const ksinDetails = await getKsinDetails({
      body: {
        catalog_version: "ONLINE",
        ksins,
        include_media: true,
        include_packlist: true
      },
      logTrace
    });
    const outletDetails = await getOutletBySiteId({
      siteId: destination_site_id,
      logTrace
    });
    // const outletMap = new Map(
    //   outletDetails.map(item => [item.outlet_id, item])
    // );
    const purchaseOrderInput = transformForStoTransferOrder({
      body
    });
    const purchaseOrderLinesInput = transformForStoTransferOrderLines({
      body,
      ksinDetails,
      outletDetails
    });

    const knexTrx = await fastify.knex.transaction();
    try {
      await Promise.all([
        upsertTransferOrder.call(knexTrx, {
          input: purchaseOrderInput,
          logTrace
        }),
        upsertTransferOrderLines.call(knexTrx, {
          input: purchaseOrderLinesInput,
          logTrace
        })
      ]);
      await knexTrx.commit();
      return { sto_number };
    } catch (error) {
      await knexTrx.rollback();
      throw error;
    }
  };
}
module.exports = postTransferOrderService;
