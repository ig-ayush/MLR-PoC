const express = require("express");
const { getLeads, getLead } = require("../controllers/leadController");

const router = express.Router();

router.get("/", getLeads);
router.get("/:id", getLead);

module.exports = router;
