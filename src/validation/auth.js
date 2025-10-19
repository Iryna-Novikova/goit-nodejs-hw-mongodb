import Joi from 'joi';

export const registerUserSchema = Joi.object({
  name: Joi.string().min(3).required().messages({
    'string.base': 'User name should be a string',
    'string.min': 'User name should be at least {#limit} characters',
    'any.required': 'User name is required',
  }),
  email: Joi.string()
    .email({
      minDomainSegments: 2,
      tlds: { allow: ['com', 'net', 'ua'] },
    })
    .required(),
  password: Joi.string().min(6).required().messages({
    'string.min': 'Password should be at least 6 characters',
    'any.required': 'Password is required',
  }),
});

export const loginUserSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().required(),
});
