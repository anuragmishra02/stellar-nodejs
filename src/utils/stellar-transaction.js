const { TransactionBuilder } = require("stellar-sdk");

const transactionPrimarySigner = async (server, signer, operations) => {
    console.log(`Transaction Signer: ${signer.publicKey()}`);
    const getAccountFromServer = await server.loadAccount(signer.publicKey())

    let transactionBuidler = new TransactionBuilder(getAccountFromServer);

    operations.forEach((op) => {
        transactionBuidler = transactionBuidler.addOperation(op);
    });

    transactionBuidler = transactionBuidler.build();

    transactionBuidler.sign(signer);

    return await server.submitTransaction(transactionBuidler);
};

const transactionSecondarySigner = async (server, primarySigner, secondarySigner, operations) => {
    const getAccountFromServer = await server.loadAccount(secondarySigner.publicKey())

    let transactionBuidler = new TransactionBuilder(getAccountFromServer);

    operations.forEach((op) => {
        transactionBuidler = transactionBuidler.addOperation(op);
    });

    transactionBuidler = transactionBuidler.build();

    transactionBuidler.sign(primarySigner);
    transactionBuidler.sign(secondarySigner);

    return await server.submitTransaction(transactionBuidler);
};

module.exports = {
    oneSigner: transactionPrimarySigner,
    twoSigners: transactionSecondarySigner
};