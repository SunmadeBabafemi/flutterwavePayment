const dotenv = require('dotenv')
dotenv.config()

const KEYS = {
    flwPubkey: process.env.FLWPUBTEST,
    flwSeckey: process.env.FLWSECTEST,
    flwEncrypt: process.env.FLWENCRYPT,
    flwCreatePayUrl: process.env.FLWCREATE_PAYMENT_URL,
    appRedirectUrl: process.env.REDIRECT_URL,
    mongoURI: process.env.MONGO_CONNECTION_URL,
    serverPort: process.env.NODE_PORT
}

module.exports = KEYS