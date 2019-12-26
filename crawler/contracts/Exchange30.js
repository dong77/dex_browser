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
            for (var i = 0; i < events.length; i++) {
                const event = events[i];
                console.log(event.transactionIndex);
                console.log(event.event);
                console.log(event.transactionHash);
                console.log(event.returnValues.blockIdx);
                console.log(event.blockNumber);
            }
        }
    };
}

module.exports = Exchange30