const mongoose = require('mongoose');
const User = require('./User');

const messageSchema = new mongoose.Schema({
  // Message schema fields...
  sender_id :{
    type:String
  },
  senderId: {
    type:String
  },
  senderFirstName:{
    type:String
  },
  senderLastName:{
    type:String
  },
  senderCountry:{
    type:String
  },
  senderImgProfile:{
    type:String
  },
  receiver_id: {
    type:String
  },
  receiverId: {
    type:String
  },
  receiverFirstName:{
    type:String
  },
  receiverLastName:{
    type:String
  },
  receiverCountry:{
    type:String
  },
  receiverImgProfile:{
    type:String
  },

  // Other fields in the Message schema...
  language: { type: String },
  level: { type: String },
  purpose: { type: [String] },
  message: { type: String },
  createdAt: {     type: Date,
                 default: Date.now},
  isRead: 
  { type: Boolean,
     default: false
  },
  threads: [    {
    sender: {
      type: String
    },
    message: {
      type: String
    },
    createdAt: {
      type: Date,
      default: Date.now
    },
    isRead: 
    {type: Boolean,
      default: false
    }
    
  }],
});

const Message = mongoose.model('Message', messageSchema);

module.exports = Message;