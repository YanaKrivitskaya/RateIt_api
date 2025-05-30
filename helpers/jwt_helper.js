const { expressjwt: jwt }  = require('express-jwt');
const secret = process.env.ACCESS_TOKEN_SECRET;
const db = require('../db');

module.exports = authorize;

function authorize() {   
    return [
        jwt ({secret: secret, algorithms: ["HS256"] }),

        async(req, res, next) =>{
            const user = await db.User.findByPk(req.auth.sub);

            if(!user) return res.status(401).json({message: 'Unauthorized'});

            req.auth = user.get();
            const refreshTokens = await user.getUser_tokens();
            req.auth.ownsToken = token => !!refreshTokens.find(x => x.token === token);
            
            next();
        }
    ]; 
}