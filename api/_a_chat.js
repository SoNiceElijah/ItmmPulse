var express = require('express');
var router = express.Router();

const $v = require('../ulils/dataChecker');
var C = require('../controllers/index'); 

router.post('/list', async (req,res) => {

    if(req.body.uid)
        delete req.body.uid;

    let data = await C.chat.list({ ...req.body, uid : req.uid});
    if(!data)
        return res.send(400);

    res.json(data);
});

router.post('/get', async (req,res) => {
    let data = await C.chat.id(req.body);
    if(!data)
        return res.send(400);

    return res.json(data);
});

router.post('/writing', async (req,res) => {
    
    if(req.body.uid)
        delete req.body.uid

    let ok = await C.chat.setWriter({
        ...req.body,
        uid : req.uid
    });

    if(!ok)
        return res.sendStatus(400);

    res.sendStatus(200);

});

router.post('/test', async (req,res) => {
    res.send('CHAT');
});

module.exports = router;