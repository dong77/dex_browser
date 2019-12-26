const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const Blocks = (connection) => {
    const schema = new Schema({
        exchange: String,
        blockIdx: Number,
        blockType: String,
        blockSize: Number,
        blockVersion: Number,
        txHash: String,
        committedAt: Number,
        verifiedAt: Number,
        finalizedAt: Number
    });

    const Block = mongoose.model('Block', schema)

    const saveBlockCommitted = async (block) => {
        await Block.deleteMany({
            exchange: block.exchange,
            blockIdx: { $gte: block.blockIdx }
        });
        await new Block({
            exchange: block.exchange,
            blockIdx: block.blockIdx,
            blockType: block.blockType,
            blockSize: block.blockSize,
            blockVersion: block.blockVersion,
            txHash: block.transactionHash,
            committedAt: block.committedAt,
        }).save();
        console.log("block", block.blockIdx, "committed / height", block.committedAt);
    }

    const saveBlockVerified = async (block) => {
        await Block.updateOne({
            exchange: block.exchange,
            blockIdx: block.blockIdx
        }, {
            verifiedAt: block.verifiedAt
        });
        console.log("block", block.blockIdx, "verified  / height", block.verifiedAt);
    }

    const saveBlockFinalized = async (block) => {
        await Block.updateOne({
            exchange: block.exchange,
            blockIdx: block.blockIdx
        }, {
            finalizedAt: block.finalizedAt
        });
        console.log("block", block.blockIdx, "finalized / height", block.finalizedAt);
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