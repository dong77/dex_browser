const Web3 = require('web3');
const fs = require('fs');
const mongoose = require('mongoose');


// const loopringAbi = JSON.parse(fs.readFileSync('./abi/ILoopringV3.abi').toString());
// const exchangeAbi = JSON.parse(fs.readFileSync('./abi/IExchangeV3.abi').toString());

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

const main = async () => {

    const web3 = new Web3('http://18.162.247.214:8545');
    const registry = UniversalRegistry(web3);

    var block =
9164812; // last processed block
    var latestBlock = block + 1;
    var exchanges = new Map();

    // Load saved exchange lists
    var initialExchanges = ["0x7D3D221A8D8AbDd868E8e88811fFaF033e68E108"];
    for (var i = 0; i < initialExchanges.length; i++) {
        const exchange = initialExchanges[i];
        exchanges.set(exchange, Exchange30(web3, exchange));
    }

    console.log("starting from last block:", block);

    while (block <= latestBlock) {
        if (block == latestBlock) {
            // update latestBlock
            // latestBlock = block + 1;
            return;
        } else {
            block += 1;
            console.log("block#", block, " ...");

            // update the exchang lists.
            const resp = await registry.processBlock(block);
            for (var i = 0; i < resp.exchanges.length; i++) {
                const exchange = resp.exchanges[i];
                console.log("found new exchange:", exchange);
                exchanges.set(exchange, Exchange30(web3, exchange));
            }

            exchanges.forEach(async (exchange, address, _) => {
                console.log("exchange:", address, "...")
                const resp = await exchange.processBlock(block);
                console.log(resp);
                console.log("exchange:", address, "done")

            });
            console.log("block#", block, " done\n\n\n\n\n");
        }
    }
}

main();