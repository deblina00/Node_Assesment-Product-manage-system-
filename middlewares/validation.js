const Joi = require("joi");

const productValidation = (data) => {
  const schema = Joi.object({
    name: Joi.string().min(3).required(),
    category: Joi.string().required(),
    description: Joi.string().required(),
  });
  return schema.validate(data);
};

module.exports = { productValidation };
