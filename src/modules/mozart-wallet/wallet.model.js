const mongoose = require('mongoose')

const schema = mongoose.Schema(
    {
        name: String,
        transactions: Array,
        total_amount: Number
    },
    {
        timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' },
    }
)
module.exports = mongoose.model('Wallet', schema)