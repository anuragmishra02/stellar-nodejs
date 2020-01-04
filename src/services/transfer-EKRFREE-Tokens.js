const StellarSdk = require("stellar-sdk");
const transaction = require("../utils/stellar-transaction");
const channelQueue = require("../utils/channelAccount");
const { Accounts, Assets } = require("../config/stacker-stellar");
const env = require("../config/project-env");

module.exports = async ({ server, userAccount }) => {
    try {                

        await transaction.twoSigners(
            server,
            Accounts.Distributer,
            channelQueue.getAccount().data,
            [
                StellarSdk.Operation.payment({
                    source: Accounts.Distributer.publicKey(),
                    destination: userAccount.publicKey(),
                    asset: Assets.EKRFREE,
                    amount: env.Stellar.freeTokensIssued
                })
            ]);
    }
    catch (ex) {
        console.log(ex);
        throw new Error(JSON.stringify({
            service: "stellar-services",
            from: "establishTrustline.js",
            message: `Error when establishing trustline for EKRFREE from user: ${userAccount.publicKey()}`
        }, null, 2));
    }
};
