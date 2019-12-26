const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const Blocks = (connection) => {
    const schema = new Schema({
        exchange: String,
        blockIdx: String,
        type: String,
        committedAt: String,
        verifiedAt: String,
        finalizedAt: String,
    });

    return {
        schema: schema,
        model: mongoose.model('Block', schema)
    };
}

module.exports = Blocks