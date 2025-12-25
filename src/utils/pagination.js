// Ye pagination utils hai jo pagination operations handle karta hai.
exports.paginate = (page = 1, limit = 10) => ({
  offset: (page - 1) * limit,
  limit: Number(limit)
});

