const {v4: uuidv4} = require('uuid')
const axios = require('axios')
const keys = require('../../config/keys')
const Payment = require('./payment.model')
const Wallet = require('../mozart-wallet/wallet.model')
const Flutterwave = require('flutterwave-node-v3')
const flw = new Flutterwave(
    keys.flwPubkey, keys.flwSeckey
)
 


exports.testEndpoint =  (data) => {
    try{
        const { email, name, password} = data
        console.log('inside',data);
        if (data.email === "bruce@banner.com"){
            return {
                error: true,
                message: 'this is error testing',
                data: null
            }
        }
        return {
            error: false ,
            message: 'testing the app',
            data,
        }       
    }catch(err){
        console.log(err);
        return {
            error: true ,
            message: 'testing the error',
            data:err
        }
    } 
}

exports.initializePay = (body, id) => {
    const stuff = {
    email: 'jack@sparrow.com',
    name: 'jack sparrow',
    phoneNumber: 12345,
    amount: '09876'
    }
    const d1 = 123455
    const {email, name, phoneNumber, amount} = body
    try {
        const reference = uuidv4()
        const paymentDetails = {
            tx_ref: reference,
            amount,
            currency: 'NGN',
            redirect_url: keys.appRedirectUrl,
            customer: {
                email,
                name,
                phonenumber: phoneNumber
            },
            meta: {
                consumer_id: id || Math.floor(Math.random()*100)
            },
            customizations: {
                title: 'Amadeus Payments',
                logo: 'http://www.piedpiper.com/app/themes/joystick-v27/images/logo.png'
            }
        } 

         const {data, status} =   axios.post(
            keys.flwCreatePayUrl,
            {
                headers:{
                    Authorization: `Bearer ${keys.flwSeckey}`
                }
            },
            paymentDetails
        )
    
      console.log(data.data.status);
        if(data.data.status === 'success'){ 
            const payment =   Payment.create({
                tx_ref: reference,
                status: 'pending',
                isPaid: false,

            })
            const completePaymentPage = data.data.link
            return {
                error: false,
                message: 'Proceed to payment completion',
                data: {
                    link: completePaymentPage
                }
            }

        } 
       
    } catch (error) {
        return{
            error: true,
            message: 'Unable to initiate Payment at this time',
            data: error.message
        }
    }
    
}

exports.confirmPayment = async (ref) => {
    const {tx_ref, status, transaction_id} = ref
    try {
        if(status === "successful"){
            const payment = await Payment.findOne({tx_ref})
            const {data} = await flw.Transaction.verify({id: transaction_id})
            if(
                data.status === "successful" 
                && data.amount === payment.amount 
                && data.currency === "NGN"
            ){
                const successPayment = await Payment.findByIdAndUpdate({tx_ref}, {isPaid: true})
                const wallet = await Wallet.findOne({name: "Mozart"})
                const previousWalletBalance = Number(wallet.total_amount)
                const newBalance = previousWalletBalance + Number(data.amount)
                await Wallet.findByIdAndUpdate({name: "Mozart"}, {total_amount: newBalance})
                return {
                    error: false,
                    message: "Payment confirmed",
                    data: [successPayment, {previousBal: previousWalletBalance}, {newBal: newBalance}  ]
                }
                

            } else {
                const failedPayment = await Payment.findByIdAndUpdate({tx_ref}, {status: "failed", isPaid: false})
                return {
                    error: true,
                    message: "Payment Unsuccessful",
                    data: failedPayment
                }
            }

        } 
    } catch (error) {
        return {
            error: true,
            message: error.message,
            data: error
        }
    }
}