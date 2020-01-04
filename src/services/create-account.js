const StellarSdk = require("stellar-sdk");
const StellarHDWallet = require("stellar-hd-wallet");
const createTransaction = require("../utils/stellar-transaction");
const channelQueue = require("../utils/channelAccount");
const { Accounts } = require("../config/stacker-stellar");
const env = require("../config/project-env");

module.exports = async ({ server }) => {
    let mnemonic = null;
    let wallet = null;

    try{
        mnemonic = StellarHDWallet.generateMnemonic();        
        wallet = StellarHDWallet.fromMnemonic(mnemonic).getKeypair(0);
    }
    catch(ex){
        console.log(ex);
        throw {
            error_message: "Error when creating random account using stellar-hd-wallet"
        };
    }

    try{                
        const { status, data, message } = channelQueue.getAccount();        

        await createTransaction.twoSigners(
            server,
            Accounts.Distributer,
            data,
            [
                StellarSdk.Operation.createAccount({
                    source: Accounts.Distributer.publicKey(),
                    destination: wallet.publicKey(),
                    startingBalance: env.Stellar.lumenBalance
                })
            ]        
        );
    
        return { wallet, mnemonic };
    }    
    catch(ex){
        if(ex.response && ex.response.data){
            console.log(ex.response.data);
            throw {
                error_message: "stellar transaction error"
            };
        }
        else{
            console.log(ex);
            throw {            
                error_message: "Internal server error"
            }
        }        
    }
};