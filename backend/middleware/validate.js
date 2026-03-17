const { validationResult } = require('express-validator');

/**
 * Middleware to run express-validator and return 400 with first error message if invalid.
 * Use after validation chains on the same route.
 */
const validate = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const firstError = errors.array()[0];
    const message = firstError.msg || 'Validation failed.';
    return res.status(400).json({ message });
  }
  next();
};

module.exports = { validate };
