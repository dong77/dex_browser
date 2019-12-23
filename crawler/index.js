const Web3 = require('web3');
const fs = require('fs');
const exchangeAbi = JSON.parse(fs.readFileSync('./IExchangeV3.abi').toString());

// console.log(exchangeAbi);

const methodMap = {
    "0x6cfd80c9": "updateAccountAndDeposit",
    "0x109916fe":"verifyBlocks"
};

const main = async (exchangeAddr, blockHeight) => {
    const web3 = new Web3('http://18.162.247.214:8545');
    const exchange = new web3.eth.Contract(exchangeAbi, exchangeAddr);

    const events = await exchange.getPastEvents('allEvents', {
        fromBlock: blockHeight,
        toBlock: blockHeight
    });


    for (var i = 0; i < events.length; i++) {
        console.log('====================\n\n');
        const txHash = events[i].transactionHash;
        const tx = await web3.eth.getTransaction(txHash);
        console.log(tx.input.slice(0, 10));
    }

}

main("0x7D3D221A8D8AbDd868E8e88811fFaF033e68E108", 9150280);