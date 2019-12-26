const Web3 = require('web3');
const fs = require('fs');
const mongoose = require('mongoose');


// const loopringAbi = JSON.parse(fs.readFileSync('./abi/ILoopringV3.abi').toString());
// const exchangeAbi = JSON.parse(fs.readFileSync('./abi/IExchangeV3.abi').toString());

const mongodbUri = "mongodb://localhost:32768/test2";
const UniversalRegistry = require('./contracts/UniversalRegistry.js');
const Loopring3 = require('./contracts/Loopring3.js');
const Exchange30 = require('./contracts/Exchange30.js');

// const methodMap = {
//     "0x6cfd80c9": "updateAccountAndDeposit",
//     "0x109916fe": "verifyBlocks"
// };

// const getExchanges = async (registryContract) => {
//     const e1 = await registryContract.methods.exchanges(0).call();
//     return [e1]
// }

const processBlockchain = async (db, web3, startBlock) => {
    const registry = UniversalRegistry(web3);

    var block = startBlock; // last processed block
    var latestBlock = startBlock + 1;
    var exchanges = new Map();

    // Load saved exchange lists
    var initialExchanges = ["0x7D3D221A8D8AbDd868E8e88811fFaF033e68E108"];
    for (var i = 0; i < initialExchanges.length; i++) {
        const exchange = initialExchanges[i];
        exchanges.set(exchange, Exchange30(web3, db, exchange));
    }

    console.log("starting from last block:", block);

    function sleep(ms) {
        const time = 15000;
        console.log("sleeping", time, "milliseconds.. / height", latestBlock)
        return new Promise(resolve => setTimeout(resolve, time));
    }

    while (block <= latestBlock) {
        while (block == latestBlock) {
            latestBlock = await web3.eth.getBlockNumber();
            if (block == latestBlock) { await sleep(); }
        }

        block += 1;
        // console.log("block#", block, " ...");

        // update the exchang lists.
        const resp = await registry.processBlock(block);
        for (var i = 0; i < resp.exchanges.length; i++) {
            const exchange = resp.exchanges[i];
            // console.log("found new exchange:", exchange);
            exchanges.set(exchange, Exchange30(web3, db, exchange));
        }

        exchanges.forEach(async (exchange, address, _) => {
            // console.log("exchange:", address, "...")
            const resp = await exchange.processBlock(block);
            // console.log(resp);
            // console.log("exchange:", address, "done")

        });
        // console.log("block#", block, " done");
    }

}

const main = async () => {
    const web3 = new Web3('http://18.162.247.214:8545');


    mongoose.connect(mongodbUri, { useNewUrlParser: true, useUnifiedTopology: true });

    const db = mongoose.connection;
    db.on('error', console.error.bind(console, 'connection error:'));
    db.once('open', function() {
        console.log("db connected:", mongodbUri);
    });

    await processBlockchain(db, web3, 9165771 - 1);
}

main();