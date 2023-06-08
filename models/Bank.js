const mongoose = require('mongoose')

const bankSchema = new mongoose.Schema({

  currentBalance: 
      {
        currentBalance: Number,
        TransactedDay: { type: Date, default: Date.now },
      },


  moneyDepositedByStudent: 
    {
      idStudent: String,
      amount: Number,
    },

  moneyWithdrawnByTeacher: 
    {
      idTeacher: String,
      amount: Number,
    }
  
});



const Bank = mongoose.model('Bank', bankSchema);

module.exports = Bank;
