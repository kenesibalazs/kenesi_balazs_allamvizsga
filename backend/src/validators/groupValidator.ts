import Joi from 'joi';

export const createGroupValidator = Joi.object({
    name: Joi.string().required(),
    majorId: Joi.string().required(),
});

export const updateGroupValidator = Joi.object({
    name: Joi.string(),
    majorId: Joi.string(),
})

