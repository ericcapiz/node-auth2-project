const jwt = require('jsonwebtoken');
const secrets = require('../config/secrets');

module.exports = (req,res,next)=>{
    const authheader = req.headers.authorization || '';
    const token = authheader.split(' ')[1];

    if(token){
        jwt.verify(token,secrets.jwtSecret,(err,decodedToken)=>{
            if(err){
                res.status(401).json({you: 'invalid token'})
            }else{
                res.decodedJwt = decodedToken;
                next();
            }
        })
    }else{
        res.status(401).json({you:"restricted access"})
    }
};

