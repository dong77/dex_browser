const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const Transfers = (connection) => {
    const schema = new Schema({
        exchange: String,
        blockIdx: Number,
        type: String, // Deposit or Withdrawal
        committedAt: Number,
        verifiedAt: Number,
        finalizedAt: Number,
        tokenId: String,
        requestedAmount: String,
        actualAmount: String
    });

    const Transfer = mongoose.model('Transfer', schema)

    return {
        schema: schema,
        Transfer: Transfer
    };
}

module.exports = Transfers