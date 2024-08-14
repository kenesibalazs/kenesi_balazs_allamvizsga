import Joi from 'joi';

export const createMajorValidator = Joi.object({
    name: Joi.string().required(),
    universityId: Joi.string().required(),
});

export const updateMajorValidator = Joi.object({
    name: Joi.string(),
    universityId: Joi.string(),
})

