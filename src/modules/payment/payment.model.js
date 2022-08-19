const mongoose = require('mongoose')

const schema = mongoose.Schema(
    {
        transaction_id: String,
        tx_ref: String,
        status: String,
        authorization: Object,
        isPaid: Boolean,
        raw: Object,
    },
    {
        timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' },
        collection: 'payments'
    }
)
module.exports = mongoose.model('Payment', schema)