const { Router } = require("express")
const validateSchema = require('../../middlewares/validateRequest')
const {initializePayController, confirmPayController, testEndpointController} = require('./payment.controller')
const {initiatePayementSchema, confrimpaySchema, testSchema} = require('./payment.schema')
const router = Router()

router.post('/initiate/:id',
    validateSchema(initiatePayementSchema, "body"),
    initializePayController
)

router.get('/confirm', 
    validateSchema(confrimpaySchema, "query"),
    confirmPayController
)

router.post('/test',
    validateSchema(testSchema, "body"),
    testEndpointController
)

module.exports = router