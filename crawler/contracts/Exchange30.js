const fs = require('fs');

const Exchange30 = (web3, address) => {
    const abi = JSON.parse(fs.readFileSync('./contracts/abi/IExchangeV3.abi').toString());
    const contract = new web3.eth.Contract(abi, address);

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
                if (e.event == "BlockCommitted") {
                    eventObjects.push({
                        type: e.event,
                        exchange: address,
                        committedAt: e.blockNumber,
                        blockIdx: e.returnValues.blockIdx,
                        transactionHash: e.transactionHash
                    });
                } else if (e.event === "BlockVerified") {
                    eventObjects.push({
                        type: e.event,
                        exchange: address,
                        verifiedAt: e.blockNumber,
                        blockIdx: e.returnValues.blockIdx
                    });
                } else if (e.event === "BlockFinalized") {
                    eventObjects.push({
                        type: e.event,
                        exchange: address,
                        finalizedAt: e.blockNumber,
                        blockIdx: e.returnValues.blockIdx
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