const express = require("express");
const {
  verifyWebhook,
  receiveWebhook
} = require("../controllers/webhookController");
const { verifyMetaSignature } = require("../middleware/metaSignature");

const router = express.Router();

router.get("/", verifyWebhook);
router.post("/", verifyMetaSignature, receiveWebhook);

module.exports = router;
