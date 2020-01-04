const envRequired = [
    "AMPQ_Url", 
    "AMPQ_Queue_Req_AccountCreation", 
    "AMPQ_Queue_Res_AccountCreation", 
    "AMPQ_Queue_Req_FreeTokens", 
    "AMPQ_Queue_Res_FreeTokens", 

    "Stellar_Server",
    "Stellar_Network",

    "Stellar_AccountSecret_Issuer", 
    "Stellar_AccountSecret_Distributer", 
    "Stellar_AssetCode_FREE", 
    "Stellar_AssetCode_POSTPAID", 
    "Stellar_User_LumenBalance", 
    "Stellar_SignupBonus_FreeTokens",

    "Stellar_ChannelAccounts",

    "Encryption_SecretKey"
];

module.exports = () => {
    envRequired.forEach(key => {
        const value = process.env[key];
        if (value === null || value === void (0)) {
            throw `${key} is not found in process.env`;
        }
    });
};
