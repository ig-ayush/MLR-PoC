const { AppError } = require("../utils/appError");
const repository = require("../database/leadRepository");
const { logger } = require("../middleware/logger");

async function listLeads() {
  return repository.findAll();
}

async function getLead(id) {
  const lead = await repository.findById(id);

  if (!lead) {
    throw new AppError("Lead not found", 404);
  }

  return lead;
}

async function createLeadIfNew(lead) {
  if (!lead?.metaLeadId) {
    throw new AppError("metaLeadId is required", 400);
  }

  const existing = await repository.findByMetaLeadId(lead.metaLeadId);

  if (existing) {
    logger.info(`Duplicate lead ignored: ${lead.metaLeadId}`);
    return {
      created: false,
      lead: existing
    };
  }

  try {
    const createdLead = await repository.insertLead(lead);
    return {
      created: true,
      lead: createdLead
    };
  } catch (error) {
    if (error?.code === "ER_DUP_ENTRY") {
      const raceWinner = await repository.findByMetaLeadId(lead.metaLeadId);

      logger.info(`Duplicate lead ignored after unique-key race: ${lead.metaLeadId}`);

      return {
        created: false,
        lead: raceWinner
      };
    }

    throw error;
  }
}

module.exports = {
  listLeads,
  getLead,
  createLeadIfNew
};
