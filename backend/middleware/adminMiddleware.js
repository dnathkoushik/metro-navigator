const Joi = require('joi');

const addStationValidation = (req, res, next) => {
    const schema = Joi.object({
        name: Joi.string().required().messages({
            'string.empty': 'Station name is required',
            'any.required': 'Station name is required'
        }),
        lines: Joi.array().items(
            Joi.object({
                line: Joi.string().required().messages({
                    'any.required': 'Line name is required'
                }),
                sequence: Joi.number().required().messages({
                    'any.required': 'Sequence number is required'
                })
            })
        ).min(1).required().messages({
            'array.min': 'At least one line is required for the station',
            'any.required': 'Lines are required'
        }),
        isInterchange: Joi.boolean().optional(),
        x: Joi.number().required(),
        y: Joi.number().required()
    });

    const { error } = schema.validate(req.body);

    if (error) {
        res.status(400);
        throw new Error(error.details[0].message);
    }

    next();
};

const blockUserValidation = (req, res, next) => {
    // If there's any body to validate for blocking, add here.
    // Usually blocking might just be a toggle, but if reason is required:
    /*
    const schema = Joi.object({
        reason: Joi.string().optional()
    });
    */
    next();
};

module.exports = {
    addStationValidation,
    blockUserValidation
};
