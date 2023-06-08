const mongoose = require('mongoose')

const lessonSchema = new mongoose.Schema({
  idStudent: String,
  studentFirstName:String,
  studentLastName:String,
  studentCountry:String,
  studentProfile:String,
  teacherProfile:String,
  idTeacher: String,
  SecondaryIdTeacher:String,
  teacherFirstName:String,
  teacherLastName:String,
  teacherCountry:String,

  language:String,
  
  notice: 
    { type: Boolean,
     default: false
    },
  timeSlot: {
    type: [String]
  },
  
  isReserved: {
    type: Boolean,
    default: false
  },
  isReservedByStudentDate: String,
  isConfirmed: {
    type: Boolean,
    default: false
  },
  isReadConfirmation: {
    type: Boolean,
    default: false
  },
  isConfirmedByTeacherDate: String,
  isRejected: {
    type: Boolean,
    default: false
  },

  isRejectedByTeacherDate: String,
  isCompleted: {
    type: Boolean,
    default: false
  },
  completedProblem: {
    type: Boolean,
    default: false
  },
  isCompletedConfirmedByStudent: String,
  billedPrice: Number,
  ranking: String,
  reservedByStudentcreatedAt: {
    type: Date,
    default: Date.now
  },
  confirmedByteacherAt: {
    type: Date,
    default: Date.now
   
  },
  completedConfirmedByStudentAt: {
    type: Date,
    default: Date.now
    
  }
});



const Lesson = mongoose.model('lesson', lessonSchema);

module.exports = Lesson