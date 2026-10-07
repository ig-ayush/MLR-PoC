const { asyncHandler } = require("../utils/asyncHandler");
const leadService = require("../services/leadService");

const getLeads = asyncHandler(async (req, res) => {
  const data = await leadService.listLeads();

  res.json({
    success: true,
    data
  });
});

const getLead = asyncHandler(async (req, res) => {
  const data = await leadService.getLead(req.params.id);

  res.json({
    success: true,
    data
  });
});

module.exports = {
  getLeads,
  getLead
};
