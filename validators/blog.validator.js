const Joi = require("joi");

const blogAddSchema = Joi.object({
  title: Joi.string().min(3).max(255).trim().required(),
  description: Joi.string().trim(),
  author: Joi.string().required(),
  state: Joi.string(),
  tags: Joi.string(),
  body: Joi.string().required().trim(),
});

const blogUpdateSchema = Joi.object({
  title: Joi.string().min(3).max(255).trim(),
  description: Joi.string().trim(),
  author: Joi.string(),
  state: Joi.string(),
  tags: Joi.string(),
  body: Joi.string().trim(),
});

async function AddBlogValidationMW(req, res, next) {
  const blogPayload = req.body;

  try {
    await blogAddSchema.validateAsync(blogPayload);
    next();
  } catch (error) {
    next({
      message: error.details[0].message,
      status: 400,
    });
  }
}

async function UpdateBlogValidationMW(req, res, next) {
  const blogPayload = req.body;

  try {
    await blogUpdateSchema.validateAsync(blogPayload);
    next();
  } catch (error) {
    next({
      message: error.details[0].message,
      status: 400,
    });
  }
}

module.exports = {
  AddBlogValidationMW,
  UpdateBlogValidationMW,
};
