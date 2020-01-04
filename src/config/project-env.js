module.exports = {
    RabbitMQ: {
        server: process.env.AMPQ_Url,
        queueNames: {
            req: {                
                createAccount: process.env.AMPQ_Queue_Req_AccountCreation,
                freeTokens: process.env.AMPQ_Queue_Req_FreeTokens
            },
            res: {                
                createAccount: process.env.AMPQ_Queue_Res_AccountCreation,
                freeTokens: process.env.AMPQ_Queue_Res_FreeTokens
            }
        }
    },
    Stellar: {
        server: process.env.Stellar_Server,
        network: process.env.Stellar_Network,
        accountSecrets: {
            issuer: process.env.Stellar_AccountSecret_Issuer,
            distributer: process.env.Stellar_AccountSecret_Distributer
        },
        assetCode: {
            free: process.env.Stellar_AssetCode_FREE,
            postpaid: process.env.Stellar_AssetCode_POSTPAID
        },
        lumenBalance: process.env.Stellar_User_LumenBalance,
        freeTokensIssued: process.env.Stellar_SignupBonus_FreeTokens,
        channelAccounts: process.env.Stellar_ChannelAccounts.split(",")
    },
    encryption: {
        secret: process.env.Encryption_SecretKey
    }
};