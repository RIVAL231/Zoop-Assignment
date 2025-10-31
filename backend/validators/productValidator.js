import Joi from 'joi';

export const validateProduct = (product) => {
  const schema = Joi.object({
    name: Joi.string().max(100).required().messages({
      'string.empty': 'Product name is required',
      'string.max': 'Product name cannot exceed 100 characters'
    }),
    description: Joi.string().max(1000).required().messages({
      'string.empty': 'Product description is required',
      'string.max': 'Description cannot exceed 1000 characters'
    }),
    price: Joi.number().min(0).required().messages({
      'number.base': 'Price must be a number',
      'number.min': 'Price cannot be negative',
      'any.required': 'Product price is required'
    }),
    imageUrl: Joi.string().uri().optional(),
    stock: Joi.number().min(0).default(0).messages({
      'number.min': 'Stock cannot be negative'
    }),
    category: Joi.string()
      .valid('Electronics', 'Fashion', 'Home', 'Beauty', 'Sports', 'Other')
      .default('Other'),
    isActive: Joi.boolean().default(true)
  });

  return schema.validate(product);
};
