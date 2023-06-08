const User = require("../models/User");
const Message = require("../models/Message");
const VirtualCreditAccount = require("../models/VirtualCreditAccount")
const Lesson =  require("../models/Lesson");
const jwt = require('jsonwebtoken');
var moment = require('moment'); // require
moment().format(); 



module.exports.saveLessonSlot_post = (req, res, next) => {
  const credits = req.body.credits;
  const timeSlot = req.body.timeSlot;
  const teacherID = req.body.teacherID;

  const token = req.cookies.jwt;
  if (token) {
    jwt.verify(token, process.env.KEY, async (err, decodedToken) => {
      if (err) {
        res.locals.user = null;
        next();
      } else {
        let user = await User.findById(decodedToken.id);
        let teacher = await User.findById(teacherID);
        res.locals.user = user;
        res.locals.teacher = teacher;

        try {
          if (parseInt(user.credits) >= parseInt(credits)) {
            await Lesson.create({
              idStudent: user._id,
              studentFirstName: user.firstName,
              studentLastName: user.lastName,
              studentCountry: user.country,
              idTeacher: teacherID,
              studentProfile:user.profile,
              teacherProfile: teacher.profile,
              SecondaryIdTeacher: teacher.idUser,
              teacherFirstName: teacher.firstName,
              teacherLastName: teacher.lastName,
              teacherCountry: teacher.country,
              notice: true,
              isReserved: true,
              timeSlot: timeSlot,
              billedPrice: credits,
            });

            await VirtualCreditAccount.updateOne(
              { _id: "646097d8d3dc09a70e20b0cb" },
              { $inc: { virtualAccount: parseInt(credits) } }
            );
            await User.updateOne(
              { _id: user._id },
              {
                $inc: { credits: -parseInt(credits) },
                $push: {
                  transaction: {
                    date: new Date().toISOString(),
                    description: "booking lesson",
                    amount: -parseInt(credits),
                    completed: "completed",
                  },
                },
              }
            );

            res.status(201).json({ user: user._id });
          } else {
         
            res.status(400).json({ error: "Insufficient credits" });
          }
        } catch (err) {
          res.status(400).json(err);
        }
  
      }
    });
  } else {
    res.locals.user = null;
    next();
  }
};



module.exports.lessonssDataConfirmation_get= async (req, res) => {
     
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
    const lessons = await Lesson.find({ idStudent: user._id });
    res.json({ lessons,moment });


  } catch (err) {
    console.error(err);
  
  }
}
})
}
}

module.exports.lessonsFinishedConfirmationNotice_get= async (req, res) => {
     
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

    const bookedLessons = await Lesson.find({ idStudent: user._id.toString()  });

    const now = new Date();
    now.setUTCHours(now.getUTCHours() + 1);
    const unixTimestamp = now.getTime();

  
   let bookedLessonsUpdate = []
      for (let i of bookedLessons){

        if(i.isConfirmed === true && i.isRejected === false &&  i.isCompleted === false && i.completedProblem === false && i.timeSlot.some(date => date < unixTimestamp)  ){

              
          bookedLessonsUpdate.push(i)
       
        }
      }
      
      res.json({bookedLessons:bookedLessonsUpdate} );



  } catch (err) {
    console.error(err);
  
  }
}
})
}
}

module.exports.lessonsFinishedConfirmation_get= async (req, res) => {
     
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

    const bookedLessons = await Lesson.find({ idStudent: user._id.toString()  });

    const now = new Date();
    now.setUTCHours(now.getUTCHours() + 1);
    const unixTimestamp = now.getTime();

  
   let bookedLessonsUpdate = []
      for (let i of bookedLessons){

        if(i.isConfirmed === true && i.isRejected === false &&  i.isCompleted === false && i.timeSlot.some(date => date < unixTimestamp)  ){

    
          bookedLessonsUpdate.push(i)
       
        }
      }
      
      res.render('lessonfinishedconfirmation',{bookedLessons:bookedLessonsUpdate,moment:moment} );



  } catch (err) {
    console.error(err);
  
  }
}
})
}
}


module.exports.lessonsFinishedConfirmation_put= async (req, res,next) => {
  const reviewInput = req.body.reviewInput
  const lessonID = req.body.lessonID;
  const token = req.cookies.jwt;


  
  if (token) {
    jwt.verify(token, process.env.KEY, async (err, decodedToken) => {
      if (err) {
        res.locals.user = null;
        next();
      } else {
        let user = await User.findById(decodedToken.id);
        res.locals.user = user;

        const lesson = await Lesson.findOne({ _id: lessonID });
        const idTeacher = lesson.idTeacher;
        const billedPrice = lesson.billedPrice;
        
        try {   

        
          const lesson = await Lesson.findOneAndUpdate(
            {        
              idStudent: user._id,
              _id: lessonID, 
                  

            },
            {
              isCompleted: true,
              ranking: reviewInput,
            },
            { new: true }

          );

          await VirtualCreditAccount.updateOne(
            { _id: "646097d8d3dc09a70e20b0cb" },
            { $inc: { virtualAccount: -parseInt(billedPrice) } }
          );
          
          await User.updateOne(
            { _id: idTeacher },
            {
              $inc: { credits: parseInt(billedPrice) },
              $push: {
                transaction: {
                  date: new Date().toISOString(),
                  description: "finished lesson",
                  amount: parseInt(billedPrice),
                  completed: "completed",
                  
                },
              },
            }
          );

              
          if (!lesson) {
            return res.status(404).json({ message: 'Lesson not found or user not authorized.' });
          }

                   
          res.status(200).json({ message: 'Lesson confirmed successfully.' });
     
        } catch (err) {
          res.status(400).json(err);
        }
        
       }      
    });

  } else {
    res.locals.user = null;
    next();
  }
}





module.exports.lessonsFinishedConfirmationReject_put= async (req, res,next) => {
  const reviewInput = req.body.reviewInput
  const lessonID = req.body.lessonID;
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

        
          const lesson = await Lesson.findOneAndUpdate(
            {        
              idStudent: user._id,
              _id: lessonID, 
        
            },
            { completedProblem: true,
              ranking: reviewInput }
              ,
      
            { new: true }
          );

              
          if (!lesson) {
            return res.status(404).json({ message: 'Lesson not found or user not authorized.' });
          }

                   
          res.status(200).json({ message: 'Lesson confirmation rejected successfully.' });
        } catch (err) {
          res.status(400).json(err);
        }
        

      }      
    });
  } else {
    res.locals.user = null;
    next();
  }
}



module.exports.lessonssDataConfirmation_put = async (req, res) => {
  const ID = req.body.ID


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
        const updatedLesson = await Lesson.findByIdAndUpdate(ID, { isReadConfirmation: true });
   
      }
       catch (err) {
  console.error(err);

}
}
})
}
}

  
    module.exports.lessonssdata_get= async (req, res) => {
     
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
        const lessons = await Lesson.find({ idTeacher: user._id });

        const messagesArray = await Message.find({ receiverId: user.idUser });
        const messagesArrayStudent = await Message.find({ senderId: user.idUser });

        let messagesArrayUpdate = [];
        for (let i of messagesArray) {
          messagesArrayUpdate.push(i);
        }

        let counter = 0;
        let isReadinThread;
        let isReadinThreadValue;

        messagesArrayUpdate.forEach(element => {


          element.threads.map(element2=>{ 
           isReadinThread = element2.isRead
           isReadinThreadValue = element2.sender
          })
        
          // Check the isRead property to conditionally apply the animation
          const animationStyle = !element.isRead || (!isReadinThread && element.threads.length>0 &&  isReadinThreadValue == element.sender_id )    ? `animation-name: colorChange; animation-duration: 2s; animation-timing-function: ease; animation-iteration-count: infinite;` : '';
         
          if (!element.isRead || (!isReadinThread && element.threads.length>0 &&  isReadinThreadValue == element.sender_id )  ) {
            counter +=1
                          }
          })

          let counterStudent = 0;
          let isReadinThreadStudent;
          let isReadinThreadValueStudent;
        
          messagesArrayStudent.forEach(element => {
        
        
              element.threads.map(element2=>{ 
                isReadinThreadStudent = element2.isRead
                isReadinThreadValueStudent = element2.sender
          })
        
                const animationStyle = !element.isRead && isReadinThreadValueStudent == element.receiver_id  || (!isReadinThreadStudent && element.threads.length>0 &&  isReadinThreadValueStudent == element.receiver_id ) 

            if ( !element.isRead && isReadinThreadValueStudent == element.receiver_id  || (!isReadinThreadStudent && element.threads.length>0 &&  isReadinThreadValueStudent == element.receiver_id )  ) {
              counterStudent +=1
                            }

          })
        
          

           
        res.json({ lessons,counter,counterStudent });

      } catch (err) {
        console.error(err);
      
      }
    }
  })
}
    }

module.exports.lessonsConfirmationNotice_get= async (req, res) => {
     
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
        const lessons = await Lesson.find({ idTeacher: user._id });
        res.json({ lessons });

      } catch (err) {
        console.error(err);
      
      }
    }
  })
}
    }   






  
module.exports.studentReservation_get = async (req, res) => {
     
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

        const bookedLessons = await Lesson.find({ idTeacher: user._id.toString()  });

       let bookedLessonsUpdate = []
          for (let i of bookedLessons){
            if(i.isConfirmed !== true && i.isRejected !== true ){


              bookedLessonsUpdate.push(i)
           
            }
          }
          
          res.render('studentReservation',{bookedLessons:bookedLessonsUpdate,moment:moment} );

    

      } catch (err) {
        console.error(err);
      
      }
    }
  })
}
}


module.exports.studentReservation_put = async (req, res, next) => {
  const lessonID = req.body.lessonID;
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
          const lesson = await Lesson.findOneAndUpdate(
            {        
              idTeacher: user._id,
              _id: lessonID, 
        

            },
            { isConfirmed: true },
            { new: true }
          );
              
          if (!lesson) {
            return res.status(404).json({ message: 'Lesson not found or user not authorized.' });
          }

                   
          res.status(200).json({ message: 'Lesson confirmed successfully.' });
        } catch (err) {
          res.status(400).json(err);
        }
        
   
      }      
    });
  } else {
    res.locals.user = null;
    next();
  }
};


module.exports.studentReservationReject_put= async (req, res, next) => {
  const lessonID = req.body.lessonID;
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
          const lesson = await Lesson.findOneAndUpdate(
            {        
              idTeacher: user._id,
              _id: lessonID, 
            },
            {  isRejected: true },
            { new: true }
          );
          
          if (!lesson) {
            return res.status(404).json({ message: 'Lesson not found or user not authorized.' });
          }

  
          await User.updateOne({ _id: lesson.idStudent }, { $inc: { credits:lesson.billedPrice }});
          await User.updateOne(
            { _id: lesson.idStudent },
            {
              $addToSet: {
                transaction: {
                  date: new Date().toISOString(),
                  description: 'returned credits',
                  amount: lesson.billedPrice ,
                  completed: 'completed'
                }
              }
            }
          );
          

          res.status(200).json({ message: 'Lesson rejected successfully.' });
        } catch (err) {
          res.status(400).json(err);
        }
        

      }      
    });
  } else {
    res.locals.user = null;
    next();
  }
};




module.exports.mylessons_get= async (req, res) => {
     
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

    const bookedLessons = await Lesson.find({ idTeacher: user._id.toString()  });

   let myLessonArray = []
      for (let i of bookedLessons){
        if(i.isConfirmed == true && i.isRejected == false  ){
          myLessonArray.push(i)
         }
      }
      
      res.render('mylessons',{myLessonArray:myLessonArray,moment:moment} );

  } catch (err) {
    console.error(err);
  
  }
}
})
}
}


module.exports.mystudents_get= async (req, res) => {
     
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

    const bookedLessons = await Lesson.find({ idTeacher: user._id.toString()  });

        let myStudentsArray = []
        
            for (let i of bookedLessons){
               if(!myStudentsArray.some(obj => obj.idStudent === i.idStudent && !obj.isRejected) ){
                myStudentsArray.push(i)

              }
            }
 
          
      res.render('mystudents',{myStudentsArray:myStudentsArray} );

  } catch (err) {
    console.error(err);
  
  }
}
})
}
}



module.exports.mybookedlessons_get = async (req, res) => {
     
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

    const bookedLessons = await Lesson.find({ idStudent: user._id.toString()  });

   let myLessonArray = []
      for (let i of bookedLessons){
        if( !i.isRejected  ){
          myLessonArray.push(i)
         }
      }
  
      res.render('mybookedlessons',{myLessonArray:myLessonArray,moment:moment} );
   
  } catch (err) {
    console.error(err);
  
  }
}
})
}
}



module.exports.myteachers_get = async (req, res) => {
     
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

    const myBookedLessons = await Lesson.find({ idStudent: user._id.toString()  });

        let myTeachersArray = []
        
            for (let i of myBookedLessons){
           
               if(!myTeachersArray.some(obj => obj.idTeacher === i.idTeacher && !obj.isRejected) ){
                myTeachersArray.push(i)
              }
            }
         
      res.render('myteachers',{myTeachersArray:myTeachersArray} );

  } catch (err) {
    console.error(err);
  
  }
}
})
}
}






