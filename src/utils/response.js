// Ye response utils hai jo response operations handle karta hai.
exports.success = (res, data) =>
  res.status(200).json({ success: true, data });

