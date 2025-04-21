const express = require('express');
const router = express.Router();
const auth = require('../middlewares/authMiddleware');
const { getProfile, updateProfile, uploadAvatar } = require('../controllers/userController');
const upload = require('../middlewares/uploadMiddleware');

router.get('/me', auth, getProfile);
// router.put('/me', auth, updateProfile);
router.put('/update', auth, updateProfile);
router.post('/avatar', auth, upload.single('avatar'), uploadAvatar);

module.exports = router;
