const router = require('express').Router();
const checkRole = require("../auth/checkRole");
const Users = require("./users-model.js");
const restricted = require("../auth/restricted-middleware");

router.get("/", restricted, checkRole(1), (req,res) => {
    Users.find()
        .then(users => {
            res.status(200).json(users);
        })
        .catch(err => res.send(err));
})

module.exports = router;