const mongoose = require('mongoose')

const accountSchema = new mongoose.Schema({

    account:{
        type:Number,
        default:0}

})


const Account = mongoose.model('account', accountSchema);

module.exports = Account;
