const bcryptjs = require("bcryptjs");
const jwt = require("jsonwebtoken");
const router = require("express").Router();
const secrets = require('../config/secrets');

const Users = require("../users/user=model.js");
const { isValid } = require("../users/users-service.js");

//new user
router.post("/register",(req,res)=>{
    const credentials = req.body;

    if(isValid(credentials)){
        const rounds = process.env.BCRYPT_ROUNDS || 8;

        //hash
        const hash = bcryptjs.hashSync(credentials.password, rounds);
        credentials.password = hash;

        //save new user
        Users
        .add(credentials)
        .then(user =>{
            res.status(201).json({data: user});
        })
        .catch(error =>{
            res.status(500).json({message: error.message})
        });
    }else{
        res.status(400).json({
            message: "provide your password"
        })
    }
});

router.post("/login", (req,res)=>{
    const {username, password} = req.body;

    if(isValid(req.body)){
        Users.findBy({username: username})
            .then(([user])=>{
                if(user && bcryptjs.compareSync(password, user.password)){
                    const token = generateToken(user);
                    res.status(200).json({message: "Access Granted", token: token});
                }else{
                    res.status(400).json({message: "invalid username/password"})
                }
            })
            .catch(error =>{
                res.status(500).json({message: error.message})
            })
    }else{
        res.status(400).json({message: "please provide username and password and the password shoud be alphanumeric"})
    }
});

function generateToken(user){
    const payload = {
        subject: user.id,
        username: user.username,
        role: user.role
    };

    const options = {
        expiresIn:"1d"
    };

    return jwt.sign(payload,secrets.jwtSecret, options);
}

module.exports = router;