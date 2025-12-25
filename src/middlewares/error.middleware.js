// Ye error.middleware middleware hai jo error.middleware check karta hai.
module.exports = (err, req, res, next) => {
  res.status(500).json({ message: err.message });
};

