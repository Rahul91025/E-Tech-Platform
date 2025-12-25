// Ye validate middleware hai jo request body ko schema ke against validate karta hai.
module.exports = (schema) => (req, res, next) => {
  const { error } = schema.validate(req.body);
  if (error) return res.status(400).json({ message: error.message });
  next();
};
