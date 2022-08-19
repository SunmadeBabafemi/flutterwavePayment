const mongoose = require('mongoose')
const app = require('./src/server')
const seedWallet = require('./src/helpers/seed')
const KEYS = require('./src/config/keys')

mongoose
    .connect(KEYS.mongoURI, {useNewUrlParser: true, useUnifiedTopology: true})
    .then(() => {
        const port = KEYS.serverPort
        app.listen(port, ()=> {
            seedWallet
            console.log(`App listening on port: ${port}`);
        })
})