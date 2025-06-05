const purchaseOrderRepo = require("../repository/purchaseOrder");
const downstreamCallsRepo = require("../repository/downstreamCalls");
const {
  transformForPurchaseOrder,
  transformForPurchaseOrderLines
} = require("../transform/purchaseOrder");
const {
  getNextTransactionNumber
} = require("../../utils/GenerateTransactionSequence");

function postPurchaseOrderService(fastify) {
  const {
    upsertOrder,
    upsertPurchaseOrderLines,
    deletePurchaseOrderLines,
    getPurchaseOrderCondition
  } = purchaseOrderRepo(fastify);
  const { getKsinDetails, getOutletBySiteId } = downstreamCallsRepo(fastify);

  return async ({ body, logTrace }) => {
    fastify.log.info({
      message: "create purchase-order service",
      logTrace
    });
    let po_number = null;

    const { po_lines, destination_site_id, transaction_reference_number } =
      body;
    const existingPo = await getPurchaseOrderCondition.call(fastify.knex, {
      condition: {
        destination_site_id,
        external_reference_number: transaction_reference_number
      },
      logTrace
    });

    if (existingPo.length) {
      po_number = existingPo[0].po_number;
      await deletePurchaseOrderLines.call(fastify.knex, {
        po_number,
        logTrace
      });
    }

    const ksins = [
      ...new Set(po_lines.map(line => line.item?.ksin).filter(Boolean))
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
      siteId: body.destination_site_id,
      logTrace
    });

    po_number =
      po_number ||
      (await getNextTransactionNumber({
        fastify,
        type: "PO"
      }));

    const purchaseOrderInput = transformForPurchaseOrder({
      poNumber: po_number,
      body,
      outletDetails
    });
    const purchaseOrderLinesInput = transformForPurchaseOrderLines({
      body,
      poNumber: po_number,
      po_lines,
      ksinDetails,
      outletDetails
    });

    const knexTrx = await fastify.knex.transaction();
    try {
      await Promise.all([
        upsertOrder.call(knexTrx, {
          input: purchaseOrderInput,
          logTrace
        }),
        upsertPurchaseOrderLines.call(knexTrx, {
          input: purchaseOrderLinesInput,
          logTrace
        })
      ]);
      await knexTrx.commit();
      return { po_number };
    } catch (error) {
      await knexTrx.rollback();
      throw error;
    }
  };
}
module.exports = postPurchaseOrderService;
