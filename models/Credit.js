const mongoose = require('mongoose')

const creditSchema = new mongoose.Schema({

   
    creditsTransactedbyStudent: [
    {
        idStudent: String,
        TransactedDay: { type: Date, default: Date.now },
        amount: Number,
    }
        ],
            
    

    creditsTransactedToTeacher: [ {
        idTeacher: String,
        TransactedDay: { type: Date, default: Date.now },
        amount: Number,
}]

  });
  

  const Credit = mongoose.model('credit', creditSchema);
  
  module.exports = Credit;