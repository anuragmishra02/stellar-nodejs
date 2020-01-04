const { Keypair } = require("stellar-sdk");
const { Stellar: { channelAccounts } } = require("./project-env");

module.exports = () => {    

    ChannelAccounts = channelAccounts.map((secretKey) => {
        return Keypair.fromSecret(secretKey)
    });

    require("../utils/channelAccount").config(ChannelAccounts);
};