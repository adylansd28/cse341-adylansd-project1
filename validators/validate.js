// Middleware genérico para JOI
export default (schema) => (req, res, next) => {
  const toValidate = ["POST", "PUT"].includes(req.method) ? req.body : {};
  const { error, value } = schema.validate(toValidate, { abortEarly: false, stripUnknown: true });
  if (error) {
    return res.status(400).json({
      message: "Validation error",
      details: error.details.map(d => d.message),
    });
  }
  if (["POST", "PUT"].includes(req.method)) req.body = value;
  next();
};
