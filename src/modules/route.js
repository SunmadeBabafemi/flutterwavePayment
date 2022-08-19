const {Router} = require('express')
const payRoute = require("./payment/payment.route")

module.exports = () =>{
    const router = Router()
    router.use('/v1', payRoute)
    return router
}