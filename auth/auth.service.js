const jwt = require('jsonwebtoken');
const db = require('../db');
const { Op } = require("sequelize");
const crypto = require('node:crypto');

const otpService = require('../auth/otp.service');

module.exports = {
    login,
    refreshToken,
    revokeToken,
    getUserById
};

async function createAccount(email){
    //validate
    if(await db.User.findOne({where: {email: email}})){
        throw `Email ${email} is already taken`;
    }

    var name = email.substr(0, email.indexOf('@')); 

    //save Account
    var newUser = await db.User.create({email: email, username: name});

    return newUser;
}

async function login({email, otp}, device, verificationKey){
    var user = await db.User.findOne({
        where: {email: email}
    });    

    if(!user){
        user = await createAccount(email);
    }

    const verifiedEmail = await otpService.verifyOtp(verificationKey, otp, email);    

    if(!verifiedEmail){
        throw "Verification code is not correct for this email";
    }

    const accessToken = generateJwt(user); 

    var refreshToken = await getRefreshTokenByUserId(user.id, device);    
    
    if(!refreshToken || !refreshToken.isActive) {
        const newRefreshToken = generateRefreshToken(user, device);
        await newRefreshToken.save();
        if(refreshToken!= null && !refreshToken.isActive){
            refreshToken.revokedDate = Date.now();
            refreshToken.replacedByToken = newRefreshToken.token;
                
            await refreshToken.save();
        }
        refreshToken = newRefreshToken;
    }
    
    return {
        account: user, 
        accessToken: accessToken, 
        refreshToken: refreshToken.token};
}

async function refreshToken({token}, device){
    const refreshToken = await getRefreshToken(token, device);    

    const user  = await refreshToken.getUser();

    // replace old refresh token with a new one and save
    const newRefreshToken = generateRefreshToken(user, device);
    refreshToken.revokedDate = Date.now();
    refreshToken.revokedByDevice = device;
    refreshToken.replacedByToken = newRefreshToken.token;
    await refreshToken.save();
    await newRefreshToken.save();

    const jwt = generateJwt(user);

    return {
        account: user, 
        accessToken: jwt,
        refreshToken: newRefreshToken.token};    
}


async function revokeToken({token}, device){
    const refreshToken = await getRefreshToken(token, device);    

    refreshToken.revokedDate = Date.now();
    refreshToken.revokedByDevice = device;
    await refreshToken.save();
    return "Ok";
}


function generateJwt(user){
    return jwt.sign({sub: user.id}, process.env.ACCESS_TOKEN_SECRET, {expiresIn: process.env.ACCESS_TOKEN_LIFE});
}

async function getRefreshTokenByUserId(userId, device){
    const refreshToken =  await db.UserToken.findOne({ where: { userId: userId, deviceId: device } });    
    return refreshToken;
}

//expires in 7 days
function generateRefreshToken(user, device){
    var token = crypto.randomBytes(40).toString('hex');
    return new db.UserToken({
        userId: user.id,
        token: token,
        expirationDate: new Date(Date.now() + 7*24*60*60*1000),
        deviceId: device
    });
}

async function getRefreshToken(token, device){
    const refreshToken =  await db.UserToken.findOne({ where: { token: token, deviceId: device } });
    if(!refreshToken || !refreshToken.isActive) throw 'UnauthorizedError';
    return refreshToken;
}

async function getUserById(id){
    const user = await db.User.findByPk(id);    

    if(!user) throw "User not found";
    return user;
}

