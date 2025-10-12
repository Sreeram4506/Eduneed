const { check } = require('express-validator');

const validateFileUpload = [
  check('title').notEmpty().withMessage('Title is required'),
  check('subject').isIn(['Math', 'Physics', 'Chemistry', 'Biology', 'English', 'Other']).withMessage('Invalid subject'),
  check('description').optional().isLength({ max: 500 }).withMessage('Description too long')
];

const handleValidationErrors = (req, res, next) => {
  const errors = require('express-validator').validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  next();
};

module.exports = { validateFileUpload, handleValidationErrors };
