const Joi = require('joi');

const validatePathQuery = (req, res, next) => {
    const schema = Joi.object({
        from: Joi.string().required().messages({
            'string.empty': 'Start station (from) is required',
            'any.required': 'Start station (from) is required'
        }),
        to: Joi.string().required().messages({
            'string.empty': 'Destination station (to) is required',
            'any.required': 'Destination station (to) is required'
        }),
        citySlug: Joi.string().optional()
    });

    const { error } = schema.validate(req.body);

    if (error) {
        res.status(400);
        throw new Error(error.details[0].message);
    }

    next();
};

module.exports = { validatePathQuery };
