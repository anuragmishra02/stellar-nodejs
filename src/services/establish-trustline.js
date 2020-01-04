const StellarSdk = require("stellar-sdk");
const transaction = require("../utils/stellar-transaction");
const { Accounts, Assets } = require("../config/stacker-stellar");

module.exports = async ({ server, userAccount }) => {
    try {
        await transaction.oneSigner(server, userAccount, [
            StellarSdk.Operation.changeTrust({
                asset: Assets.EKRFREE,                
            })
        ]);
    }    
    catch(ex){
        if(ex.response && ex.response.data){
            console.log(ex.response.data);
        }
        else{
            console.log(ex.message);
        }
        throw new Error(JSON.stringify({
            service: "stellar-services",
            from: "establishTrustline.js",
            message: `Error when establishing trustline for EKRFREE from user: ${userAccount.publicKey()}`
        }, null, 2));
    }    
};
