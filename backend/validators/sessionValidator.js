import Joi from 'joi';

export const validateSession = (session) => {
  const schema = Joi.object({
    title: Joi.string().max(200).required().messages({
      'string.empty': 'Session title is required',
      'string.max': 'Title cannot exceed 200 characters'
    }),
    description: Joi.string().max(500).required().messages({
      'string.empty': 'Session description is required',
      'string.max': 'Description cannot exceed 500 characters'
    }),
    products: Joi.array().items(Joi.string()).optional(),
    status: Joi.string().valid('scheduled', 'live', 'ended').default('scheduled'),
    startTime: Joi.date().optional(),
    endTime: Joi.date().optional()
  });

  return schema.validate(session);
};
