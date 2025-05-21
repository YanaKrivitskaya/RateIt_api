const express = require('express');
const router = express.Router();
const Joi = require('joi');
const authService = require('./auth.service');
const authorize = require('../helpers/jwt_helper');
const otpService = require('../auth/otp.service');
const validateRequest = require('../helpers/validate_request');

module.exports = router;

//routes
router.post('/verify-email', verifyEmail);
router.post('/login', authenticateSchema, login);
router.post('/refresh-token', tokenSchema, refreshToken);
router.post('/revoke-token', authorize(), tokenSchema, revokeToken);

async function verifyEmail(req, res, next) {
    otpService.sendOtpToEmail(req.body.email)
    .then((verificationKey) => res.json({verificationKey}))
    .catch(next);   
}

function authenticateSchema(req, res, next) {
    const schema = Joi.object({
        email: Joi.string().required(),
        otp: Joi.string().required()
    });
    validateRequest(req, next, schema);
}

function tokenSchema(req, res, next) {
    const schema = Joi.object({
        token: Joi.string().required()
    });
    validateRequest(req, next, schema);
}

function login(req, res, next){
    var device = req.headers["device-info"];
    var verificationKey = req.headers["verification-key"];
    authService.login(req.body, device, verificationKey)
        .then(({account, accessToken, refreshToken}) => {
            setCookieToken(res, refreshToken),
            res.json({account, accessToken})
        })
        .catch((error) => {
            // Pass the error to Express error handler middleware
            next(error);
        })
}

function refreshToken(req, res, next){    
    var device = req.headers["device-info"];
    authService.refreshToken(req.body, device)
        .then(({account, accessToken, refreshToken}) => {    
            setCookieToken(res, refreshToken),        
            res.json({account, accessToken})
        })
        .catch((error) => {
            // Pass the error to Express error handler middleware
            next(error);
        })
}

function revokeToken(req, res, next){    
    const token = req.body.token || req.cookies.refreshToken;
    var device = req.headers["device-info"];

    if(!token) return res.status(400).json({message: 'Token is required'});

    if (!req.user.ownsToken(token)) {
        return res.status(401).json({ message: 'Unauthorized' });
    }

    authService.revokeToken({token}, device)
        .then(() => {            
            res.json({message: 'Token revoked'});
        })
        .catch(next);
}

function setCookieToken(res, token){
    const cookieOptions = {
        httpOnly: true,
        expires: new Date(Date.now() + 7*24*60*60*1000)
    };
    res.cookie('refreshToken', token, cookieOptions);
}
