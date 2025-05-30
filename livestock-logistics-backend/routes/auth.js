const express = require('express');
const router  = express.Router();
const path    = require('path');
const multer  = require('multer');
const { registerUser, loginUser, forgotPassword, resetPassword } = require('../controllers/authController');

// — Multer setup —
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(__dirname, '../uploads/transporterDocs'));
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + '-' + file.originalname);
  }
});
const upload = multer({ storage });
const multiUpload = upload.fields([
  { name: 'gstCertificate', maxCount: 1 },
  { name: 'panCard',       maxCount: 1 },
  { name: 'license',       maxCount: 1 },
  { name: 'vehicleRc',     maxCount: 1 },
  { name: 'insurance',     maxCount: 1 }
]);

// — Routes —
router.post('/register',    multiUpload, registerUser);
router.post('/login',       loginUser);
router.post('/forgot-password', forgotPassword);
router.post('/reset-password/:token', resetPassword);

module.exports = router;
