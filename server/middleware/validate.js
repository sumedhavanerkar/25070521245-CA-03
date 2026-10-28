import { validationResult } from 'express-validator';
import { AppError } from '../utils/AppError.js';

// Run express-validator checks and return errors if any
export const validate = (validations) => {
  return async (req, res, next) => {
    for (const validation of validations) {
      const result = await validation.run(req);
      if (!result.isEmpty()) break;
    }
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      const messages = errors.array().map((e) => `${e.path}: ${e.msg}`).join('; ');
      return next(new AppError(messages, 422));
    }
    next();
  };
};
