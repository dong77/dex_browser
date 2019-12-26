const fs = require('fs');

const Loopring3 = (web3) => {

    const address = "0x8745074248634f37327Ee748137C8b31238002C7";
    const abi = JSON.parse(fs.readFileSync('./contracts/abi/ILoopringV3.abi').toString());
    const contract = new web3.eth.Contract(abi, address);

    return {
        address: address,
        abi: abi,
        contract: contract
    };
}

module.exports = Loopring3