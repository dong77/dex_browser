const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const Blocks = (connection) => {
    const schema = new Schema({
        exchange: String,
        blockIdx: Number,
        blockType: String,
        blockSize: Number,
        blockVersion: Number,
        committedAt: String,
        verifiedAt: String,
        finalizedAt: String,
        transactionHash: String

    });

    const Block = mongoose.model('Block', schema)

    const saveBlockCommitted = async (block) => {
        await new Block({
            exchange: block.exchange,
            blockIdx: parseInt(block.blockIdx),
            blockType: block.blockType,
            blockSize: block.blockSize,
            blockVersion: block.blockVersion,
            committedAt: block.committedAt,
            transactionHash: block.transactionHash,
        }).save();
    }

    return {
        schema: schema,
        Block: Block,
        saveBlockCommitted: saveBlockCommitted
    };
}

module.exports = Blocks