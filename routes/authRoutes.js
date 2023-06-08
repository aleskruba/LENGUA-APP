const { Router } = require('express');
const authController = require('../controllers/authController');
const lessonController = require('../controllers/lessonController');
const messageController = require('../controllers/messageController');
const { requireAuth, checkUser,verifyUser,checkTeachers} = require('../middleware/authMiddleware');

const router = Router();

router.get('/profile',requireAuth, async (req, res) => {
    res.render('profile')
 });
 

router.get('/signup', authController.signup_get);
router.post('/signup', authController.signup_post);
router.get('/login', authController.login_get);
router.post('/login', authController.login_post);
router.get('/logout', authController.logout_get);

router.get('/update',requireAuth,checkUser, authController.update_get);
router.put('/update', authController.update_put);

router.get('/changepassword',requireAuth,checkUser, authController.changepassword_get);
router.post('/changepassword',requireAuth,checkUser, authController.changepassword_post);

router.post('/fpassword', verifyUser,authController.fpassword_post);
router.get('/fpassword',authController.fpassword_get) 

router.post('/verifyOTP',authController.verifyOTP_post) 

router.get('/resetPassword',authController.resetPassword_get) 
router.post('/resetPassword',authController.resetPassword_post) 

router.post('/deletelanguage',requireAuth,authController.deleteLanguage_post) 
router.post('/deleteTeachlanguage',requireAuth,authController.deleteTeachLanguage_post) 

router.post('/updateLanguage',requireAuth,authController.updateLanguage_put) 
router.post('/updateTeachLanguage',requireAuth,authController.updateTeachLanguage_put) 
router.get('/getLanguage',requireAuth,authController.getLanguage_get) 

router.get('/getteachlanguage',requireAuth,authController.getTeachLanguage_get) 

router.get('/teacherzoneupdate',requireAuth,authController.teacherZoneUpdateGet) 
router.put('/teacherzoneupdate',requireAuth,authController.teacherZoneUpdatePut) 

router.get('/teacherzoneupdate/schedule',requireAuth,authController.teacherZoneUpdateScheduleGet)

router.put('/saveScheduleSlot',requireAuth,authController.saveScheduleSlotPost)
router.get('/getTeachingSlots',requireAuth,authController.getTeachingSlots)


router.get('/wallet',requireAuth,authController.wallet_get) 

router.get('/payment',requireAuth,authController.payment_get) 

router.get('/teachers',requireAuth,checkTeachers, authController.teachers_get) 
router.get('/teachers/:id', requireAuth,checkTeachers,authController.teachers_getID)
router.get('/teachers/:id/slot', requireAuth,checkTeachers,authController.teachers_SlotsGetID)  

router.get('/teachersdata',requireAuth,checkTeachers, authController.teachers_data_get
) 

router.get('/updateTransaction',requireAuth,authController.transaction_get) 
router.post('/updateTransaction',requireAuth,authController.transaction_post) 

router.get('/policies',requireAuth,authController.policies_get) 


// lessonns


router.post('/saveLessonSlot',requireAuth,lessonController.saveLessonSlot_post) 
router.get('/lessonssdata',requireAuth,lessonController.lessonssdata_get) 
router.get('/studentreservation',requireAuth,lessonController.studentReservation_get) 
router.put('/studentReservation',requireAuth,lessonController.studentReservation_put) 
router.put('/studentReservationReject',requireAuth,lessonController.studentReservationReject_put) 

router.get('/mylessons',requireAuth,lessonController.mylessons_get)
router.get('/mystudents',requireAuth,lessonController.mystudents_get)

router.get('/mybookedlessons',requireAuth,lessonController.mybookedlessons_get)
router.get('/myteachers',requireAuth,lessonController.myteachers_get)
router.get('/lessonsConfirmationNotice',requireAuth,lessonController.lessonsConfirmationNotice_get)

router.get('/lessonssDataConfirmation',requireAuth,lessonController.lessonssDataConfirmation_get)
router.put('/lessonssDataConfirmation',requireAuth,lessonController.lessonssDataConfirmation_put)


router.get('/confirmfinishedlesson',requireAuth,lessonController.lessonsFinishedConfirmation_get)
router.put('/confirmFinishedLesson',requireAuth,lessonController.lessonsFinishedConfirmation_put)
router.put('/confirmFinishedLessonReject',requireAuth,lessonController.lessonsFinishedConfirmationReject_put)
router.get('/confirmfinishedlessonnotice',requireAuth,lessonController.lessonsFinishedConfirmationNotice_get)



// messages student ->teacher
router.post('/createnewmessage',requireAuth,messageController.createNewMessage_post)
router.get('/studentmessage',requireAuth,messageController.studentMessage_get) 
router.get('/studentmessage/:id',requireAuth,messageController.studentMessages_get) 
router.put('/studentmessage',requireAuth,messageController.studentMessage_putID) 
router.put('/studentmessageChangeStatus',requireAuth,messageController.studentmessageChangeStatusPUT) 



router.get('/teacherstudentmessage',requireAuth,messageController.teacherstudentMessage_get) 
router.get('/teacherstudentmessage/:id',requireAuth,messageController.teacherstudentMessageID_get) 
router.put('/teacherstudentmessage',requireAuth,messageController.teacherstudentMessage_putID) 
router.put('/teachermessageChangeStatus',requireAuth,messageController.teacherMessageChangeStatusPUT) 



module.exports = router;