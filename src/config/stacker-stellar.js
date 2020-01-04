const { Keypair, Asset } = require("stellar-sdk");
const { Stellar: { accountSecrets, assetCode } } = require("./project-env");

const Accounts = {
    Issuer: Keypair.fromSecret(accountSecrets.issuer),
    Distributer: Keypair.fromSecret(accountSecrets.distributer),
};

const Assets = {
    EKR: new Asset(assetCode.postpaid, Accounts.Issuer.publicKey()),
    EKRFREE: new Asset(assetCode.free, Accounts.Issuer.publicKey())
};

module.exports = {
    Accounts,
    Assets
};