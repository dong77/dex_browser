const fs = require('fs');
const Blocks = require('../schema/Blocks');

const Exchange30 = (web3, db, address) => {
    const abi = JSON.parse(fs.readFileSync('./contracts/abi/IExchangeV3.abi').toString());
    const contract = new web3.eth.Contract(abi, address);

    const blocks = Blocks(db);

    return {
        address: address,
        abi: abi,
        contract: contract,
        processBlock: async (block) => {
            console.log(address, 'at', block)
            const events = await contract.getPastEvents("AllEvents", {
                fromBlock: block,
                toBlock: block
            });
            var eventObjects = [];
            for (var i = 0; i < events.length; i++) {
                const e = events[i];
                console.log(e)
                const blockNumber = parseInt(e.blockNumber);
                const blockIdx = parseInt(e.returnValues.blockIdx);
                if (e.event === "BlockCommitted") {
                    const input = (await web3.eth.getTransaction(e.transactionHash)).input;
                    await blocks.saveBlockCommitted({
                        exchange: address,
                        committedAt: blockNumber,
                        blockIdx: blockIdx,
                        blockType: "Deposits",
                        blockSize: 100,
                        blockVersion: 0,
                        transactionHash: e.transactionHash,
                    })
                } else if (e.event === "BlockVerified") {
                    await blocks.saveBlockVerified({
                        exchange: address,
                        blockIdx: blockIdx,
                        verifiedAt: blockNumber
                    });
                } else if (e.event === "BlockFinalized") {
                    await blocks.saveBlockFinalized({
                        exchange: address,
                        blockIdx: blockIdx,
                        finalizedAt: blockNumber
                    });
                } else if (e.event === "DepositRequested") {
                    eventObjects.push({
                        type: e.event,
                        exchange: address,
                        requestAt: e.blockNumber,
                        requestIdx: e.returnValues.depositIdx,
                        accountId: e.returnValues.accountID,
                        tokenId: e.returnValues.tokenID,
                        amount: e.returnValues.amount,
                        pubKeyX: e.returnValues.pubKeyX,
                        pubKeyY: e.returnValues.pubKeyY
                    });
                } else if (e.event === "WithdrawalRequested") {
                    eventObjects.push({
                        type: e.event,
                        exchange: address,
                        requestAt: e.blockNumber,
                        requestIdx: e.returnValues.withdrawalIdx,
                        accountId: e.returnValues.accountID,
                        tokenId: e.returnValues.tokenID,
                        amount: e.returnValues.amount
                    });
                } else {
                    console.warn("skip event of type", e.event);
                }
            }

            return {
                events: eventObjects
            }
        }
    };
}

module.exports = Exchange30