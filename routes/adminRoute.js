const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController');
const authController = require('./../controllers/authController');


router.post('/login', authController.login);
router.post('/signup', authController.signup);
router.use(authController.protect);
router.delete('/resetserver',adminController.reset);


module.exports = router;