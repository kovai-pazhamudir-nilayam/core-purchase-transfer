const transferOrderRepo = require("../repository/transferOrder");
const downstreamCallsRepo = require("../repository/downstreamCalls");
const {
  transformForStoTransferOrder,
  transformForStoTransferOrderLines
} = require("../transform/transferOrder");
const {
  getNextTransactionNumber
} = require("../../utils/GenerateTransactionSequence");

function postTransferOrderService(fastify) {
  const {
    upsertTransferOrder,
    upsertTransferOrderLines,
    deleteStoTransferLines,
    getTransferOrderByConditin
  } = transferOrderRepo(fastify);
  const { getKsinDetails, getOutletBySiteId } = downstreamCallsRepo(fastify);

  return async ({ body, logTrace }) => {
    fastify.log.info({
      message: "create sto transfer-order service",
      logTrace
    });
    let sto_number = null;
    const {
      sto_lines,
      destination_site_id,
      source_site_id,
      transaction_reference_number
    } = body;
    const existingStoOrder = await getTransferOrderByConditin.call(
      fastify.knex,
      {
        condition: {
          source_site_id,
          external_reference_number: transaction_reference_number
        },
        logTrace
      }
    );

    if (existingStoOrder.length) {
      sto_number = existingStoOrder[0].sto_number;
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
    sto_number =
      sto_number ||
      (await getNextTransactionNumber({
        type: "ST",
        fastify
      }));

    const purchaseOrderInput = transformForStoTransferOrder({
      body,
      stoNumber: sto_number
    });
    const purchaseOrderLinesInput = transformForStoTransferOrderLines({
      body,
      ksinDetails,
      outletDetails,
      stoNumber: sto_number
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
