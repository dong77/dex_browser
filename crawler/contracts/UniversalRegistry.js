const fs = require('fs');

const UniversalRegistry = (web3) => {

    const address = "0x4c2103152a1a402af283fa52903569f05477611f";
    const abi = JSON.parse(fs.readFileSync('./contracts/abi/IUniversalRegistry.abi').toString());
    const contract = new web3.eth.Contract(abi, address);


    const getExchangeAddress = (event) => {
        return event.returnValues.exchangeAddress;
    }

    return {
        address: address,
        abi: abi,
        contract: contract,
        processBlock: async (block) => {
            const events = await contract.getPastEvents('ExchangeForged', {
                fromBlock: block,
                toBlock: block
            });
            var exchanges = [];
            for (var i = 0; i < events.length; i++) {
                exchanges = exchanges.concat(getExchangeAddress(events[i]));
            }

            return {
                exchanges: exchanges
            }
        }
    };
}

module.exports = UniversalRegistry