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

    if(!req.body.ts)
        return res.sendStatus(400);

    let data = await C.event.getOlder(req.body.ts,req.uid);

    let handler = async (events) => {

        C.timer.stop(req.uid,50);
        if(events.length == 1 && events[0].type == 'none')
        {
            return res.json([{
                type : 'restart'
            }]);
        }
        else
        {
            let output = [];

            let msgEvents = events.filter(e => e.type == 'message');
            if(msgEvents.length != 0)
            {
                data = msgEvents.map(e => e.content); 
                data = data.map(d =>  ( {...d, me : d.uid == req.uid }));
                output.push({
                    type : 'msg',
                    content : data,
                    
                    ts : Math.max(...msgEvents.map(e => e.ts))
                });

            }

            let writeEvents = events.filter(e => e.type == 'writing');
            if(writeEvents.length != 0)
            {
                output.push({
                    type : 'write',
                    content : writeEvents.map(e => e.content),
                    
                    ts : Math.max(...writeEvents.map(e => e.ts))
                });
            }

            let newMembers = events.filter(e => e.type == 'newteammember');
            if(newMembers.length != 0)
            {
                output.push({
                    type : 'new',
                    content : 'teamMember',

                    ts : Math.max(...newMembers.map(e => e.ts))
                })
            }

            res.json(output);
        }
    };

    if(!data || data.length == 0)
    {
        C.event.on('event' + req.uid, handler);
        C.timer.start(req.uid,50,20 * 1000, () => {
            C.event.push({
                type : 'none',
                uid : req.uid
            })
        });
    }
    else 
    {
        await handler(data);
    }

});

router.post('/last', async (req,res) => {
   
    if(req.body.cids)
        delete req.body.cids;

    let data = await C.message.getUserHistory({cids : req.user.chat_ids, ...req.body});

    if(data === false)
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

router.post('/emoji', async (req,res) => {
    res.json(await C.message.emoji());
});

router.post('/test', async (req,res) => {
    res.send('MESSAGE');
});



module.exports = router;