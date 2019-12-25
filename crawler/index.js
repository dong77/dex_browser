const Web3 = require('web3');
const fs = require('fs');
const mongoose = require('mongoose');


// const loopringAbi = JSON.parse(fs.readFileSync('./abi/ILoopringV3.abi').toString());
// const exchangeAbi = JSON.parse(fs.readFileSync('./abi/IExchangeV3.abi').toString());

const UniversalRegistry = require('./UniversalRegistry.js')

const methodMap = {
    "0x6cfd80c9": "updateAccountAndDeposit",
    "0x109916fe": "verifyBlocks"
};

const getExchanges = async (registryContract) => {
    const e1 = await registryContract.methods.exchanges(0).call();
    return [e1]
}

const main = async (loopringAddr, exchangeAddr, blockHeight) => {

    var lastBlock = 8967526; // registry is deployed
    var latestBlock = 8967536;
    var exchanges = [];

    const web3 = new Web3('http://18.162.247.214:8545');
    const registry = UniversalRegistry(web3);

    while(lastBlock <= latestBlock) {
        console.log("block#", lastBlock, " ...");

        const resp = await registry.processBlock(lastBlock);
        // console.log(resp.exchanges);

        lastBlock++;

        console.log("block#", lastBlock, " done");

    }


    // const exchanges = await getExchanges(registry);

    // for (var i = 0; i < exchanges.length; i++) {
    //     console.log('====================\n\n', exchanges[i]);
    // }



    // const exchange = new web3.eth.Contract(exchangeAbi, exchangeAddr);

    // const events = await exchange.getPastEvents('allEvents', {
    //     fromBlock: blockHeight,
    //     toBlock: blockHeight
    // });


    // for (var i = 0; i < events.length; i++) {
    //     console.log('====================\n\n');
    //     const txHash = events[i].transactionHash;
    //     const tx = await web3.eth.getTransaction(txHash);
    //     console.log(tx.input.slice(0, 10));
    // }

}

main(
    "0x8745074248634f37327Ee748137C8b31238002C7",
    "0x7D3D221A8D8AbDd868E8e88811fFaF033e68E108",
    9150280
);