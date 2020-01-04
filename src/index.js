const StellarSdk = require("stellar-sdk");
const env = require("./config/project-env");
const channelAccount = require("./config/configureChannelQueue");

channelAccount();

env.Stellar.network === "public" ? StellarSdk.Network.usePublicNetwork() : StellarSdk.Network.useTestNetwork();
const StellarServer = new StellarSdk.Server(env.Stellar.server);

const services = require("./services");
const amqp = require("./message-queue");
const stackerCrypto = require("./utils/stackerCrypto");
const StellarHDWallet = require("stellar-hd-wallet");


amqp.config()
    .then(() => {
        console.log("Service started");

        amqp.createAccount(async () => {
            try {
                const { mnemonic, wallet } = await services.createAccount({ server: StellarServer });
                const data = {
                    account: wallet.publicKey(),
                    mnemonic: stackerCrypto.encrypt(mnemonic, wallet.publicKey())
                };
                return { error: null, data };
            }
            catch (ex) {
                console.log(ex);
                return { error: "request failed", data: null };
            }
        });

        amqp.requestFreeTokens(async (userData) => {     
            try{
                console.log("userData");
                console.log(userData[0]);
                const mnemonic = stackerCrypto.decrypt(userData[0].mnemonic, userData[0].account);
                console.log(mnemonic);
    
                let wallet = StellarHDWallet.fromMnemonic(mnemonic).getKeypair(0).secret();
                wallet = StellarSdk.Keypair.fromSecret(wallet);
    
                await services.establishTrustline({ server: StellarServer, userAccount: wallet });
                await services.transferFreeTokens({ server: StellarServer, userAccount: wallet });
                return { error: null, data: "Transferred Tokens" };
            }                   
            catch(ex){
                console.log(ex);
                return { error: "request failed", data: null };
            }            
        });

    });