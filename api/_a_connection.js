var express = require('express');
var router = express.Router();

var C = require('../controllers/index');

router.post('/register', async (req,res) => {
    
    let uid = await C.user.register(req.body);

    if(!uid)
        return res.send(400);

    let team = await C.team.name({name :'developers'});
    let tid = team._id + "";
    let ok = await C.team.add({tid : tid, uid : uid });

    if(!ok)
        res.send(500);
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

router.use(async (req,res,next) => {

    let c = await C.connection.check({...req.body, ...req.cookies });

    if(!c)
        return next();
        
    let { uid, token } = c;      
    req.user = await C.user.id(uid);         
    req.uid = req.user._id + "";      
    req.token = token;      
    
    next();      
});      
    
router.post('/logout', async (req,res) => {      
        
    C.connection.close(req);      
    res.send(200);
    
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
