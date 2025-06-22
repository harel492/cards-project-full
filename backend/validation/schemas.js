const Joi = require('joi');

const phoneRegex = /^0[2-9]\d{7,8}$/;

const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*\-_])[A-Za-z\d!@#$%^&*\-_]{8,}$/;

const nameSchema = Joi.object({
  first: Joi.string().min(2).max(50).required().trim(),
  middle: Joi.string().max(50).allow('').trim(),
  last: Joi.string().min(2).max(50).required().trim()
});

const imageSchema = Joi.object({
  url: Joi.string().uri().allow(''),
  alt: Joi.string().max(100).allow('')
});

const addressSchema = Joi.object({
  state: Joi.string().max(50).allow('').trim(),
  country: Joi.string().min(2).max(50).required().trim(),
  city: Joi.string().min(2).max(50).required().trim(),
  street: Joi.string().min(2).max(100).required().trim(),
  houseNumber: Joi.number().integer().min(1).required(),
  zip: Joi.string().max(20).allow('').trim()
});

const registerUserSchema = Joi.object({
  name: nameSchema.required(),
  phone: Joi.string().pattern(phoneRegex).required()
    .messages({
      'string.pattern.base': 'Phone number must be a valid Israeli phone number (e.g., 050-0000000)'
    }),
  email: Joi.string().email().required().lowercase(),
  password: Joi.string().pattern(passwordRegex).required()
    .messages({
      'string.pattern.base': 'Password must be at least 8 characters long and contain at least one uppercase letter, one lowercase letter, one number, and one special character (!@#$%^&*-_)'
    }),
  image: imageSchema,
  address: addressSchema.required(),
  isBusiness: Joi.boolean().default(false)
});

const loginUserSchema = Joi.object({
  email: Joi.string().email().required().lowercase(),
  password: Joi.string().required()
});

const updateUserSchema = Joi.object({
  name: Joi.object({
    first: Joi.string().min(2).max(50).optional().trim(),
    middle: Joi.string().max(50).allow('').optional().trim(),
    last: Joi.string().min(2).max(50).optional().trim()
  }),
  phone: Joi.string().pattern(phoneRegex).optional()
    .messages({
      'string.pattern.base': 'Phone number must be a valid Israeli phone number (e.g., 050-0000000)'
    }),
  email: Joi.string().email().optional().lowercase(),
  image: Joi.object({
    url: Joi.string().uri().allow('').optional(),
    alt: Joi.string().max(100).allow('').optional()
  }),
  address: Joi.object({
    state: Joi.string().max(50).allow('').optional().trim(),
    country: Joi.string().min(2).max(50).optional().trim(),
    city: Joi.string().min(2).max(50).optional().trim(),
    street: Joi.string().min(2).max(100).optional().trim(),
    houseNumber: Joi.number().integer().min(1).optional(),
    zip: Joi.string().max(20).allow('').optional().trim()
  })
}).min(1);

const changeUserStatusSchema = Joi.object({
  isBusiness: Joi.boolean().required()
});

const createCardSchema = Joi.object({
  title: Joi.string().min(2).max(100).required().trim(),
  subtitle: Joi.string().min(2).max(100).required().trim(),
  description: Joi.string().min(2).max(1000).required().trim(),
  phone: Joi.string().pattern(phoneRegex).required()
    .messages({
      'string.pattern.base': 'Phone number must be a valid Israeli phone number (e.g., 050-0000000)'
    }),
  email: Joi.string().email().required().lowercase(),
  web: Joi.string().uri().allow(''),
  image: imageSchema,
  address: addressSchema.required()
});

const updateCardSchema = Joi.object({
  title: Joi.string().min(2).max(100).trim(),
  subtitle: Joi.string().min(2).max(100).trim(),
  description: Joi.string().min(2).max(1000).trim(),
  phone: Joi.string().pattern(phoneRegex)
    .messages({
      'string.pattern.base': 'Phone number must be a valid Israeli phone number (e.g., 050-0000000)'
    }),
  email: Joi.string().email().lowercase(),
  web: Joi.string().uri().allow(''),
  image: imageSchema,
  address: addressSchema
}).min(1);

const updateBizNumberSchema = Joi.object({
  bizNumber: Joi.number().integer().min(1000000).max(9999999).required()
});

const validate = (schema) => {
  return (req, res, next) => {
    const { error } = schema.validate(req.body, {
      abortEarly: false,
      stripUnknown: true
    });

    if (error) {
      const errorMessage = error.details.map(detail => detail.message).join(', ');
      return res.status(400).json({
        success: false,
        error: errorMessage
      });
    }

    next();
  };
};

module.exports = {
  registerUserSchema,
  loginUserSchema,
  updateUserSchema,
  changeUserStatusSchema,
  createCardSchema,
  updateCardSchema,
  updateBizNumberSchema,
  validate
};