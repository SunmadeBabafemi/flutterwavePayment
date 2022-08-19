const Wallet = require('../modules/mozart-wallet/wallet.model')

exports.createWallet = async () => {
    const wallets = await Wallet.countDocuments()
    if(wallets !== 0){
        return
    } else{
        await Wallet.insertMany({
        name: 'Mozart',
        transactions: [],
        total_amount: 0
        })
    }
}
