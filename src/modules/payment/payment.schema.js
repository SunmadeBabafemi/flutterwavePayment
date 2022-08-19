const Joi = require('joi')

exports.initiatePayementSchema = Joi.object({
    email: Joi.string().required(),
    name: Joi.string().required(),
    phoneNumber: Joi.number().positive(),
    amount: Joi.number().positive()
})

exports.confrimpaySchema = Joi.object({
    tx_ref: Joi.string().required(),
    status: Joi.string().required(),
    transaction_id: Joi.string().required(),
})

exports.testSchema = Joi.object({
    name: Joi.string().required(),
    email: Joi.string().required(),
    password: Joi.string().required(),
})