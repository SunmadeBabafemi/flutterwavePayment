const {createResponse} = require('../../helpers/createResponse')
const { HTTP } = require('../../constants/http')
const {RESPONSE} = require('../../constants/response')
const createError = require('../../helpers/createError')
const paymentService = require('./payment.service')


exports.testEndpointController = async(req, res, next) => {
    try {
        console.log("h11",req.body);
        const {error, message, data} = paymentService.testEndpoint(
            req.body)
        if (error) {
            return next(
                createError(HTTP.BAD_REQUEST, [
                    {
                        status: RESPONSE.ERROR,
                        message,
                        statusCode:
                            data instanceof Error ? HTTP.SERVER_ERROR : HTTP.BAD_REQUEST,
                        data
                    }
                ])
            );
        }
        return createResponse(message, data)(res, HTTP.OK);
    } catch (error) {
        console.log(error);
        return next(createError.InternalServerError(error));
    }
}

exports.initializePayController = async(req, res, next) =>{
    try {
        const {error, message, data} = paymentService.initializePay(
            req.body,
            req.params.id
        )
        if (error) {
            return next(
                createError(HTTP.BAD_REQUEST, [
                    {
                        status: RESPONSE.ERROR,
                        message,
                        statusCode:
                        data instanceof Error ? HTTP.SERVER_ERROR : HTTP.BAD_REQUEST,
                        data
                    }
                ])
            );
        }
        return createResponse(message, data)(res, HTTP.OK);
    } catch (error) {
        return next(createError.InternalServerError(err));
    }    
}

exports.confirmPayController = async(req, res, next) => {
    const query = {
        tx_ref: req.query.tx_ref,
        status: req.query.status,
        transaction_id: req.query.transaction_id
    }
    const {error, message, data} = paymentService.confirmPayment(query)
        if(error){
        return next({
            status: "error",
            message: message,
            data: data
        })
    } else{
        return next({
            status: "ok",
            message: message,
            data: data
        })
    }
}