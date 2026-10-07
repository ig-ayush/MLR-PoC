const { loadEnv } = require("../config/env");
const { logger } = require("../middleware/logger");
const { fetchLeadById } = require("./metaGraphService");
const { normalizeMetaLead } = require("./metaLeadNormalizer");
const leadService = require("./leadService");
const { emitNewLead } = require("../websocket/socket");

function extractLeadEvents(payload) {
  const events = [];

  if (!payload || payload.object !== "page" || !Array.isArray(payload.entry)) {
    return events;
  }

  for (const entry of payload.entry) {
    if (!Array.isArray(entry.changes)) continue;

    for (const change of entry.changes) {
      if (change.field !== "leadgen") continue;

      const value = change.value || {};
      if (!value.leadgen_id) continue;

      events.push({
        leadId: String(value.leadgen_id),
        pageId: value.page_id ? String(value.page_id) : entry.id ? String(entry.id) : null
      });
    }
  }

  return events;
}

async function processLeadEvent(event) {
  const env = loadEnv();

  if (env.META_PAGE_ID && event.pageId && event.pageId !== env.META_PAGE_ID) {
    logger.warn(`Ignoring leadgen event for unexpected Page ${event.pageId}`);
    return {
      processed: false,
      reason: "unexpected_page"
    };
  }

  logger.info(`Lead ID detected: ${event.leadId}`);
  logger.info(`Fetching lead from Meta: ${event.leadId}`);

  const metaLead = await fetchLeadById(event.leadId);
  const normalized = normalizeMetaLead(metaLead);

  const result = await leadService.createLeadIfNew(normalized);

  if (result.created) {
    logger.info(`Lead stored: ${normalized.metaLeadId}`);
    emitNewLead(result.lead);
    logger.info(`New lead event emitted: ${normalized.metaLeadId}`);
  }

  return result;
}

async function processWebhook(payload) {
  const events = extractLeadEvents(payload);

  if (events.length === 0) {
    return {
      handled: false,
      processed: 0
    };
  }

  let processed = 0;
  let created = 0;

  for (const event of events) {
    try {
      const result = await processLeadEvent(event);
      processed += 1;
      if (result?.created) created += 1;
    } catch (error) {
      logger.error(`Lead processing failed for ${event.leadId}: ${error.message}`);
      throw error;
    }
  }

  return {
    handled: true,
    processed,
    created
  };
}

module.exports = {
  extractLeadEvents,
  processWebhook
};
