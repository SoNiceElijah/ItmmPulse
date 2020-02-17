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

    let data = await C.message.getOlder({ ...req.body, cids : req.user.chat_ids});
    
    if(data === false)
        return res.send(400);

    if(!data || data.length == 0)
    {
        C.event.on('message' + req.uid, async (event) => {
            let data = await C.message.getOlder({ ...req.body, cids : req.user.chat_ids});
            res.json(data);
        });
    }
    else
        return res.json(data);

});

router.post('/last', async (req,res) => {
   
    if(req.body.cids)
        delete req.body.cids;

    let data = await C.message.getUserHistory({cids : req.user.chat_ids, ...req.body});

    if(!data)
        return res.send(400);

    res.json(data);

});

router.post('/send', async (req,res) => {
    
    if(req.body.uid)
        delete req.body.uid; 

    let ok = await C.message.send({...req.body, uid : req.uid});
    if(!ok)
        return res.send(400);

    res.send(200);

});

router.post('/whisper', async (req,res) => {
    
    if(req.body.uid)
        delete req.body.uid; 

    let cid = await C.message.sendToUser({...req.body, uid : req.uid});
    if(!cid)
        return res.send(400);

    res.json({id : cid});
});

router.post('/test', async (req,res) => {
    res.send('MESSAGE');
});

module.exports = router;