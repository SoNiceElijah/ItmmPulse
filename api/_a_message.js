var express = require('express');
var router = express.Router();

const C = require('../controllers/index');

router.post('/get', async (req,res) => {
    
    if(req.body.cids)
        delete req.body.cids;

    let data = await C.message.get({ ...req.body , cids : req.user.chat_ids});
    if(!data)
        return res.send(400);   

    res.json(data);

});

router.post('/history', async (req,res) => {

    if(req.body.cids)
        delete req.body.cids;

    let data = await C.message.getHistory({ ...req.body, cids : req.user.chat_ids});
    if(!data)
        return res.send(400);

    res.json(data);

});

router.post('/updates', async (req,res) => {

    

});

router.post('/send', async (req,res) => {
    
});

router.post('/test', async (req,res) => {
    res.send('MESSAGE');
});

module.exports = router;