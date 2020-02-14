var express = require('express');
var router = express.Router();

var C = require('../controllers/index');

router.post('/register', async (req,res) => {
    
    let ok = C.user.register(req.body);
    if(!ok)
        res.send(400);
    else
        res.send(200);

});

router.post('/login', async (req,res) => {

    console.log(req.body);
    
    let token = await C.connection.open(req.body);

    if(token)
        res.json({token});
    else
        res.send(400);

});

router.post('/logout', async (req,res) => {

});

router.use(async (req,res,next) => {
    next();
});

module.exports = router;

//DEBUG TEAM!!!!!
C.team.name({name :'developers'}).then((t) => {
    if(!t)
        C.team.new({
            name : 'developers',
            members : []
        })
});
