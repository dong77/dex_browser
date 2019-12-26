const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const Blocks = (connection) => {
    const schema = new Schema({
        exchange: String,
        blockIdx: Number,
        blockType: String,
        blockSize: Number,
        blockVersion: Number,
        committedAt: Number,
        verifiedAt: Number,
        finalizedAt: Number,
        transactionHash: String
    });

    const Block = mongoose.model('Block', schema)

    const saveBlockCommitted = async (block) => {
        await new Block({
            exchange: block.exchange,
            blockIdx: block.blockIdx,
            blockType: block.blockType,
            blockSize: block.blockSize,
            blockVersion: block.blockVersion,
            committedAt: block.committedAt,
            transactionHash: block.transactionHash,
        }).save();
    }

    const saveBlockVerified = async (block) => {
        await Block.updateOne({
            exchange: block.exchange,
            blockIdx: block.Idx
        }, {
            verifiedAt: block.committedAt
        });
    }

    const saveBlockFinalized = async (block) => {
        await Block.updateOne({
            exchange: block.exchange,
            blockIdx: block.Idx
        }, {
            finalizedAt: block.committedAt
        });
    }

    return {
        schema: schema,
        Block: Block,
        saveBlockCommitted: saveBlockCommitted,
        saveBlockVerified: saveBlockVerified,
        saveBlockFinalized: saveBlockFinalized
    };
}

module.exports = Blocks