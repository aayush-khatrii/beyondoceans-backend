import Joi from 'joi';

const phoneOTPschema = Joi.object({
    phone: Joi.string().pattern(/^[6-9]\d{9}$/).message('The phone number is not valid').required(),
    country: Joi.string().valid('india').required()
});

const phoneLoginschema = Joi.object({
    phone: Joi.string().pattern(/^[6-9]\d{9}$/).message('The phone number is not valid').required(),
    country: Joi.string().valid('india').required(),
    otp: Joi.number().integer().min(100000).max(999999).required().messages({'number.min': 'OTP must be a 6-digit number','number.max': 'OTP must be a 6-digit number','any.required': 'OTP is required'}),
    hash: Joi.string().pattern(/^.*\..*$/).required().messages({'string.empty': 'Hash is required','string.pattern.base': 'Invalid Hash'})
});

const emailOTPschema = Joi.object({
    email: Joi.string().email().message('The email address is not valid').required(),
    country: Joi.string().regex(/india/).required(),
});

const emailLoginschema = Joi.object({
    email: Joi.string().email().message('The email address is not valid').required(),
    country: Joi.string().valid('india').required(),
    otp: Joi.number().integer().min(100000).max(999999).required().messages({'number.min': 'OTP must be a 6-digit number','number.max': 'OTP must be a 6-digit number','any.required': 'OTP is required'}),
    hash: Joi.string().pattern(/^.*\..*$/).required().messages({'string.empty': 'Hash is required','string.pattern.base': 'Invalid Hash'})
});


export { phoneOTPschema, phoneLoginschema, emailOTPschema, emailLoginschema };