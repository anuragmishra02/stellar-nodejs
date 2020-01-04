class ChannelQueue {

    constructor() {
        this.accounts = null;
    }

    config(accounts) {        
        this.accounts = accounts.map(acc => ({
            status: true,
            account: acc
        }));
    }

    getAccount() {
        let availableAccounts = [];

        this.accounts.reduce((accumulator, currentValue) => {
            if (currentValue.status) {
                accumulator.push(currentValue.account);
            }
            return accumulator;
        }, availableAccounts);

        if (availableAccounts.length === 0) {
            return {
                status: false,      
                message: "All channel accounts are busy"
            }
        }

        // Change status of first available account to false
        this.accounts = this.accounts.map((data, index) => {
            return (availableAccounts[0].publicKey() === data.account.publicKey()) ? { status: false, account: data.account } : data
        });

        return {
            status: true,            
            data: this.accounts[0].account
        };
    }

    resetAccount(acc) {
        this.accounts = this.accounts.map((data) => {
            return (acc.publicKey() === data.publicKey()) ? { status: false, ...data } : data;
        });
    }

}

const accountsQueue = new ChannelQueue();

module.exports = accountsQueue;