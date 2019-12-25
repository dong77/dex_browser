const fs = require('fs');

const UniversalRegistry = (web3) => {

    const address = "0x4c2103152a1a402af283fa52903569f05477611f";
    const abi = JSON.parse(fs.readFileSync('./abi/IUniversalRegistry.abi').toString());
    const contract = new web3.eth.Contract(abi, address);

    return {
        address: address,
        abi: abi,
        contract: contract,
        processBlock: async (height) => {
            const events = await contract.getPastEvents('ExchangeForged', {
                fromBlock: height,
                toBlock: height
            });
            for (var i = 0; i < events.length; i++) {
                console.log(events[i]);
            }


            return {
                exchanges: ["xyz"]
            }
        }
    };
}

module.exports = UniversalRegistry