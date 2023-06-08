const mongoose = require('mongoose');

const virtualCreditAccountSchema = new mongoose.Schema({
  virtualAccount: {
    type: Number,
    default: 0
  }
});

const VirtualCreditAccount = mongoose.model('VirtualCreditAccount', virtualCreditAccountSchema);

module.exports = VirtualCreditAccount;
