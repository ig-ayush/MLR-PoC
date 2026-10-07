const express = require("express");
const crypto = require("crypto");
const { loadEnv } = require("../config/env");
const { createLeadIfNew } = require("../services/leadService");
const { emitNewLead } = require("../websocket/socket");

const router = express.Router();

router.post("/leads", async (req, res, next) => {
  const env = loadEnv();

  if (env.NODE_ENV === "production" || !env.ENABLE_TEST_ROUTES) {
    return res.status(404).json({
      success: false,
      message: "Test routes are disabled"
    });
  }

  try {
    const { name = null, email = null, phone = null } = req.body || {};

    const lead = {
      metaLeadId: `manual-${crypto.randomUUID()}`,
      name,
      email,
      phone
    };

    const result = await createLeadIfNew(lead);

    if (result.created) {
      emitNewLead(result.lead);
    }

    return res.status(result.created ? 201 : 200).json({
      success: true,
      data: result.lead,
      created: result.created
    });
  } catch (error) {
    next(error);
  }
});

module.exports = router;
