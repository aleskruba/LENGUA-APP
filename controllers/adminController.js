const User = require("../models/User");
const Bank = require("../models/Bank");
const Credit = require("../models/Credit");
const Lesson = require("../models/Lesson");
const Message = require("../models/Message");
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt')
const nodemailer = require('nodemailer');
const otpGenerator = require('otp-generator')
var moment = require('moment'); // require
moment().format(); 


module.exports.banktransactions = (req, res, next) => {
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
          const transactionsArray = await Bank.find();
          res.render('banktransactions', { moment: moment, transactionsArray: transactionsArray });
    
        } catch (err) {
          const errors = handleErrors(err);
          res.status(400).json({ errors });
        }
      }
    });
  } else {
    res.locals.user = null;
    next();
  }
};


module.exports.allusers = (req, res, next) => {
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
                    let users = await User.find();
                    res.render('allusers', { moment: moment, users: users });
 
        } catch (err) {
          const errors = handleErrors(err);
     //     res.status(400).json({ errors });
        }
      }
    });
  } else {
    res.locals.user = null;
    next();
  }
};



module.exports.allusersID = (req, res, next) => {
   const id = req.params.id;
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
  
            let selectedUser = await User.find({ idUser: id});
            selectedUser = selectedUser[0];
            res.render('allusersID', { moment: moment, selectedUser: selectedUser });

     
          }
           catch (err) {
          res.status(400).json({ err });
        }
      }
    });
  } else {
    res.locals.user = null;
    next();
  }
};

module.exports.allusersPUT = async (req, res, next) => {
  const idUser = req.params.id;
  const updateData = req.body;
  const newLearnLang = req.body.learnlang;
  const newTeachArray = req.body.teachlang;

  try {
    const selectedUser = await User.findOne({ idUser: idUser });
    
    await User.updateOne({ _id: selectedUser._id }, updateData);
    await User.updateOne({ _id: selectedUser._id }, { $set: { learnlang: newLearnLang } });
    await User.updateOne({ _id: selectedUser._id }, { $set: { teachlang: newTeachArray } });
    
    res.redirect(`/allusers/${idUser}`);
  } catch (err) {
    res.status(400).json({ err });
  }
}



module.exports.allclases = (req, res, next) => {
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
                    let lessons = await Lesson.find();
                    res.render('allclases', { moment: moment, lessons: lessons });
 
        } catch (err) {
          const errors = handleErrors(err);
     //     res.status(400).json({ errors });
        }
      }
    });
  } else {
    res.locals.user = null;
    next();
  }
};



module.exports.allclasesID = async (req, res, next) => {
  const id = req.params.id;

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
          let lesson = await Lesson.findById(id);
          res.render('allclasesID', { moment: moment, lesson: lesson });
        } catch (err) {
          const errors = handleErrors(err);
          // res.status(400).json({ errors });
        }
      }
    });
  } else {
    res.locals.user = null;
    next();
  }
};


module.exports.changePasswordAdminGet = async (req, res, next) => {
  const idUser = req.params.id;

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
          const selectedUser = await User.findOne({ idUser: idUser });
          res.render('changePasswordAdminGet', { moment: moment, selectedUser: selectedUser });
        } catch (err) {
  
        }
      }
    });
  } else {
    res.locals.user = null;
    next();
  }
};


module.exports.changePasswordAdminPut = async (req, res, next) => {
  const idUser = req.params.id;
  const token = req.cookies.jwt;
  const { password} = req.body;

 
  if (token) {
    jwt.verify(token, process.env.KEY, async (err, decodedToken) => {
      if (err) {
        res.locals.user = null;
        next();
      } else {
        let user = await User.findById(decodedToken.id);
        res.locals.user = user;
        try {
          const selectedUser = await User.findOne({ idUser: idUser });

          if(password.length < 6){
            throw Error('incorrect password')
          }

          const hashedPassword = await bcrypt.hash(password, 10);
          await User.updateOne({_id:selectedUser.id},{password:hashedPassword});
          res.status(201).json({ user: user._id }); 

        } catch (err) {

  
        }
      }
    });
  } else {
    res.locals.user = null;
    next();
  }
};



module.exports.accesdenied = (req, res) => {
        try {    
               res.render('accesdenied');
 
        } catch (err) {
          res.status(400).json({ errors });
        }

};