const Joi = require('joi');

const registerValidation = (req, res, next) => {
    const schema = Joi.object({
        name: Joi.string().required().messages({
            'string.empty': 'Name is required',
            'any.required': 'Name is required'
        }),
        email: Joi.string().email().required().messages({
            'string.email': 'Please include a valid email',
            'string.empty': 'Email is required',
            'any.required': 'Email is required'
        }),
        password: Joi.string().min(6).required().messages({
            'string.min': 'Password must be at least 6 characters',
            'string.empty': 'Password is required',
            'any.required': 'Password is required'
        }),
        type: Joi.string().valid('user', 'admin').default('user').messages({
            'any.only': 'Type must be either user or admin'
        })
    });

    const { error } = schema.validate(req.body);

    if (error) {
        res.status(400);
        throw new Error(error.details[0].message);
    }

    next();
};

module.exports = { registerValidation };
