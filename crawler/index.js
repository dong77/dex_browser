const Web3 = require('web3');
const fs = require('fs');
const mongoose = require('mongoose');

const settlements = require('./settlements.js');

const loopringAbi = JSON.parse(fs.readFileSync('./abi/ILoopringV3.abi').toString());
const registryAbi = JSON.parse(fs.readFileSync('./abi/IUniversalRegistry.abi').toString());
const exchangeAbi = JSON.parse(fs.readFileSync('./abi/IExchangeV3.abi').toString());

// console.log(exchangeAbi);

const methodMap = {
    "0x6cfd80c9": "updateAccountAndDeposit",
    "0x109916fe": "verifyBlocks"
};

const getExchanges = async (registryContract) => {
    return registryContract.methods.exchanges(0).call();
}

const main = async (loopringAddr, registryAddr, exchangeAddr, blockHeight) => {
    settlements.info("hi");

    const web3 = new Web3('http://18.162.247.214:8545');
    const loopring = new web3.eth.Contract(loopringAbi, loopringAddr);
    const registry = new web3.eth.Contract(registryAbi, registryAddr);

    // console.log(registry);

    const exchanges = await getExchanges(registry);

    console.log(exchanges);



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
    "0x4c2103152a1a402af283fa52903569f05477611f",
    "0x7D3D221A8D8AbDd868E8e88811fFaF033e68E108",
    9150280
);