const Message = require('../models/Message');
const User = require("../models/User");
const VirtualCreditAccount = require("../models/VirtualCreditAccount")
const Lesson =  require("../models/Lesson");
const jwt = require('jsonwebtoken');
var moment = require('moment'); // require
moment().format(); 


module.exports.createNewMessage_post = async (req, res, next) => {
  const token = req.cookies.jwt;

  if (token) {
    jwt.verify(token, process.env.KEY, async (err, decodedToken) => {
      if (err) {
        res.locals.user = null;
        next();
      } else {
        try {
          // Find the user based on the decoded token
          const user = await User.findById(decodedToken.id);

          // Extract data from request body
          const { receiverId, language, level, purpose, message } = req.body;

          // Find the receiver user based on the receiverId
          const receiverUser = await User.findOne({ idUser: receiverId });

          if (!receiverUser) {
            // Handle case when receiver user is not found
            return res.status(404).json({ error: 'Receiver user not found' });
          }

          // Create a new Message document
          const newMessage = new Message({
            sender_id: user._id,
            senderId: user.idUser,
            senderFirstName:user.firstName,
            senderLastName:user.lastName,
            senderCountry:user.country,
            senderImgProfile:user.profile,
            receiverId,
            receiver_id:receiverUser._id,
            receiverFirstName:receiverUser.firstName,
            receiverLastName:receiverUser.lastName,
            receiverCountry:receiverUser.country,
            receiverImgProfile:receiverUser.profile,
            language,
            level,
            purpose,
            message,
            createdAt: new Date(),
            threads: [], // Start with an empty threads array
          });

          // Save the newMessage to the database
          await newMessage.save();

          // Send success response with receiverUser data
          res.status(201).json({ message: 'Message created successfully', newMessage, receiverUser });
        } catch (error) {
          // Handle error and send error response
          res.status(500).json({ error: 'Failed to create message', details: error.message });
        }
      }
    });
  } else {
    res.locals.user = null;
    next();
  }
};




module.exports.studentMessage_get = async (req, res, next) => {
  const token = req.cookies.jwt;

  if (token) {
    jwt.verify(token, process.env.KEY, async (err, decodedToken) => {
      if (err) {
        res.locals.user = null;
        next();
      } else {
        let user = await User.findById(decodedToken.id);
        res.locals.user = user;

        try {
          const messagesArray = await Message.find({ receiverId: user.idUser });

          let messagesArrayUpdate = [];
          for (let i of messagesArray) {
            messagesArrayUpdate.push(i);
          }


          const escapedMessagesArrayUpdate = JSON.stringify(messagesArrayUpdate).replace(/'/g, "\\'");
          res.render('studentMessageID', { messagesArrayUpdate: escapedMessagesArrayUpdate, moment: moment });
        } catch (err) {
          console.error(err);
        }
      }
    });
  }
};




const mongoose = require('mongoose');

module.exports.studentMessages_get = async (req, res, next) => {
  const id = req.params.id;
  console.log(id.length)
 
  if (id.length !== 24) {  res.redirect('/accesdenied'); next()};

 
  const token = req.cookies.jwt;

  if (token) {
    jwt.verify(token, process.env.KEY, async (err, decodedToken) => {
      if (err) {
        res.locals.user = null;
        next();
      } else {
        let user = await User.findById(decodedToken.id);
        res.locals.user = user;

        try {
          // Check if id is a valid ObjectId
          if (!mongoose.isValidObjectId(id)) {
            console.log('Invalid id format');
            // Handle the error condition as needed, e.g., return an error response or redirect to an error page
            return;
          }

          const messageObject = await Message.findById(id);
          const messagesArray = await Message.find({ receiverId: user.idUser });

  
          let correctParams = []
          messagesArray.forEach((element) => {correctParams.push(element._id.toString()) }) 
          if (!correctParams.includes(id)) {{ res.redirect('/accesdenied'); next();}}
    
          let messagesArrayUpdate = [];
          for (let i of messagesArray) {
            messagesArrayUpdate.push(i);
          }

          // Check if the current user is the receiver or sender of the message
          if (messageObject.receiver_id == user.id.toString() || messageObject.sender_id == user.id.toString()) {
            res.render('studentMessageIDnext', { messageObject: messageObject, messagesArrayUpdate: JSON.stringify(messagesArrayUpdate).replace(/'/g, "\\'"), moment: moment });
          } else {
            // If the current user is neither the receiver nor the sender, return an error or redirect to a different page
            res.status(403).render('accesdenied');
            // or res.redirect('/access-denied');
          }
        } catch (err) {
          console.error(err);
        }
      }
    });
  }
};

module.exports.studentMessage_putID = async (req, res, next) => {
  
  const token = req.cookies.jwt;
  const {id,message} = req.body

 
  if (token) {
    jwt.verify(token, process.env.KEY, async (err, decodedToken) => {
      if (err) {
        res.locals.user = null;
        next();
      } else {
        let user = await User.findById(decodedToken.id);
        res.locals.user = user;

        try {
      
           const updatedMessage = await Message.findOneAndUpdate(
            { _id: id },
            { $push: { threads: { sender:user.id, message: message, createdAt: new Date() } } },
            { new: true }
          );
 
          
          res.status(200).json({ message: 'Message updated successfully.' });
        } catch (err) {
          console.error(err);
          // Handle the error...
        }
      }
    });
  }   else {   
      res.locals.user = null;
      next();}
};


module.exports.studentmessageChangeStatusPUT = async (req, res, next) => {
  const token = req.cookies.jwt;
  const { id } = req.body;

  if (token) {
    jwt.verify(token, process.env.KEY, async (err, decodedToken) => {
      if (err) {
        res.locals.user = null;
        next();
      } else {
        let user = await User.findById(decodedToken.id);
        let message = await Message.findById(id);
        res.locals.user = user;
    

        if (user.id != message.sender_id ) {
      

                
        try {
          const updatedMessage = await Message.findOneAndUpdate(
            { _id: id },
            { $set: { isRead: true, 'threads.$[].isRead': true } },
            { new: true }
                  );

            
          res.status(200).json({ message: 'Message updated successfully.' });
        } catch (err) {
          console.error(err);
          // Handle the error...
        }
      } }
    
      
    });
  } else {
    res.locals.user = null;
    next();
  }
};

//// Teacher -> student message 


module.exports.teacherstudentMessage_putID = async (req, res, next) => {
  
  const token = req.cookies.jwt;
  const {id,message} = req.body

 
  if (token) {
    jwt.verify(token, process.env.KEY, async (err, decodedToken) => {
      if (err) {
        res.locals.user = null;
        next();
      } else {
        let user = await User.findById(decodedToken.id);
        res.locals.user = user;

           try {
      
           const updatedMessage = await Message.findOneAndUpdate(
            { _id: id },
            { $push: { threads: { sender:user.id, message: message, createdAt: new Date() } } },
            { new: true }
          );
 
          
          res.status(200).json({ message: 'Message updated successfully.' });
        } catch (err) {
          console.error(err);
          // Handle the error...
        }
      
      }
    });
  }   else {   
      res.locals.user = null;
      next();}
};


module.exports.teacherstudentMessage_get = async (req, res,next) => {

  const token = req.cookies.jwt;

  if (token) {
    jwt.verify(token, process.env.KEY, async (err, decodedToken) => {
      if (err) {
        res.locals.user = null;
        next();
      } else {
        let user = await User.findById(decodedToken.id);
        res.locals.user = user;
    
        try {
   
          const messagesArray = await Message.find({ senderId: user.idUser });

          let messagesArrayUpdate = []
            for (let i of messagesArray){
                messagesArrayUpdate.push(i)
                 
            }

   
            res.render('teacherStudentMessageID', {  messagesArrayUpdate: JSON.stringify(messagesArrayUpdate).replace(/'/g, "\\'"), moment: moment });

 
        } catch (err) {
          console.error(err);
        }
      }
    });
  }
};


module.exports.teacherstudentMessageID_get = async (req, res,next) => {
  const id = req.params.id;

  if (id.length !== 24) {  res.redirect('/accesdenied'); next()};

  const token = req.cookies.jwt;

  if (token) {
    jwt.verify(token, process.env.KEY, async (err, decodedToken) => {
      if (err) {
        res.locals.user = null;
        next();
      } else {
        let user = await User.findById(decodedToken.id);
        res.locals.user = user;
    
        try {
          const messageObject = await Message.findById(id);
          const messagesArray = await Message.find({ senderId: user.idUser });



          let correctParams = []
          messagesArray.forEach((element) => {correctParams.push(element._id.toString()) }) 
          if (!correctParams.includes(id)) {{ res.redirect('/accesdenied'); next();}}





          let messagesArrayUpdate = []
            for (let i of messagesArray){
                messagesArrayUpdate.push(i)
                 
            }



          // Check if the current user is the receiver or sender of the message
          if (messageObject.receiver_id == user.id.toString()|| messageObject.sender_id == user.id.toString()) {
            res.render('teacherStudentMessageIDnext', { messageObject: messageObject, messagesArrayUpdate: JSON.stringify(messagesArrayUpdate).replace(/'/g, "\\'"), moment: moment });

 
          } else {
            // If the current user is neither the receiver nor the sender, return an error or redirect to a different page
            res.status(403).render('accesdenied');
            // or res.redirect('/access-denied');
          }
        } catch (err) {
          console.error(err);
        }
      }
    });
    
  }
};





module.exports.teacherMessageChangeStatusPUT = async (req, res, next) => {
  const token = req.cookies.jwt;
  const { id } = req.body;

  if (token) {
    jwt.verify(token, process.env.KEY, async (err, decodedToken) => {
      if (err) {
        res.locals.user = null;
        next();
      } else {
        let user = await User.findById(decodedToken.id);
        let message = await Message.findById(id);
        res.locals.user = user;
       

        if (user.id != message.receiver_id ) {

      
           try {
          const updatedMessage = await Message.findOneAndUpdate(
            { _id: id },
            { $set: { isRead: true, 'threads.$[].isRead': true } },
            { new: true }
          );

          res.status(200).json({ message: 'Message updated successfully.' });
        } catch (err) {
          console.error(err);
          // Handle the error...
        }
      }
    
    
    }
    });
  } else {
    res.locals.user = null;
    next();
  }
};