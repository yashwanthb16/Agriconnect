const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const transportCtrl = require('../controllers/transportControllers');

// basic multer setup for uploads
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.join(__dirname, '..', 'uploads'));
  },
  filename: function (req, file, cb) {
    const unique = Date.now() + '-' + Math.round(Math.random() * 1e9);
    cb(null, unique + '-' + file.originalname);
  }
});

const upload = multer({ storage });

// Routes
router.post('/register', transportCtrl.registerTransportDriver);
router.post('/upload/:driverId/:fileType', upload.single('file'), transportCtrl.uploadFile);
router.post('/send-mobile-otp/:driverId', transportCtrl.sendMobileOtp);
router.post('/send-email-otp/:driverId', transportCtrl.sendEmailOtp);
router.put('/verify-mobile/:driverId', transportCtrl.verifyMobileOtp);
router.put('/verify-email/:driverId', transportCtrl.verifyEmailOtp);
router.put('/submit/:driverId', transportCtrl.submitDriverRegistration);

// User's own registrations
router.get('/my-registrations/:userId', transportCtrl.getMyRegistrations);

// Get available transports for booking
router.get('/available', transportCtrl.getAvailableTransports);

// Admin routes
router.put('/admin/approve/:driverId', transportCtrl.approveDriver);
router.put('/admin/reject/:driverId', transportCtrl.rejectDriver);

router.put('/:driverId', transportCtrl.updateDriverRegistration);
router.get('/', transportCtrl.getAllDrivers);
router.get('/:driverId', transportCtrl.getDriverRegistration);

module.exports = router;
