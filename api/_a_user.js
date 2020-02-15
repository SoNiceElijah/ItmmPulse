const express = require('express');
const router = express.Router();

const $v = require('../ulils/dataChecker');
var C = require('../controllers/index'); 

router.post('/me', async (req,res) => {
    res.json(req.user);
});

router.post('/get', async (req,res) => {
    
    let data = await C.user.get(req.body);
    if(!data)
        return res.send(400);
    else
        return res.json(data);
        
});

router.post('/test', async (req,res) => {
    res.send('USER');
});

module.exports = router;