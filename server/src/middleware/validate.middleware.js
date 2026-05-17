import { AppError } from "../utils/AppError.js";

export const validate = (schema) => (req, res, next) => {
  const result = schema.safeParse({
    body: req.body,
    query: req.query,
    params: req.params,
  });

  if (!result.success) {
    const message = result.error.issues.map((i) => i.message).join(", ");
    return next(new AppError(message, 400));
  }

  // Express 5 makes req.query/params read-only — store parsed values separately
  req.validated = {
    body: result.data.body ?? req.body,
    query: result.data.query ?? req.query,
    params: result.data.params ?? req.params,
  };

  next();
};
