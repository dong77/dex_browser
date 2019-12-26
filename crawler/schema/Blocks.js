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
        transaction: String
    });

    const Block = mongoose.model('Block', schema)

    const saveBlockCommitted = async (block) => {
        // eventObjects.push({
        //            type: e.event,
        //            exchange: address,
        //            committedAt: e.blockNumber,
        //            blockIdx: e.returnValues.blockIdx,
        //            transactionHash: e.transactionHash
        //        });

        const instance = new Block({
            exchange: block.exchange,
            blockIdx: block.blockIdx,
            type: "",
            committedAt: block.committedAt,
            transaction: block.transactionHash
        });

        await instance.save();
    }


    return {
        schema: schema,
        model: Block,
        saveBlockCommitted: saveBlockCommitted
    };
}

module.exports = Blocks