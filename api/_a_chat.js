var express = require('express');
var router = express.Router();

const $v = require('../ulils/dataChecker');
var C = require('../controllers/index'); 

router.post('/list', async (req,res) => {
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

router.post('/test', async (req,res) => {
    res.send('CHAT');
});

module.exports = router;