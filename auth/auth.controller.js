const express = require('express');
const router = express.Router();
const Joi = require('joi');
const authService = require('./auth.service');
const otpService = require('../auth/otp.service');

module.exports = router;

//routes
router.post('/verify-email', verifyEmail);

async function verifyEmail(req, res, next) {
    otpService.sendOtpToEmail(req.body.email)
    .then((verificationKey) => res.json({verificationKey}))
    .catch(next);   
}