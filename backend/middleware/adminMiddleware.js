const Joi = require('joi');

const addStationValidation = (req, res, next) => {
    const schema = Joi.object({
        name: Joi.string().required().messages({
            'string.empty': 'Station name is required',
            'any.required': 'Station name is required'
        }),
        // Add other station fields validation here as per requirement (graph like structure)
        // For now just name is validated
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
