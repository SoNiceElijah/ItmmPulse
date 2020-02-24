var express = require('express');
var router = express.Router();

const C = require('../controllers/index');

router.post('/get', async (req,res) => {

    if(req.body.uid)
        delete req.body.uid;
 
    let data = await C.team.get({ ...req.body, uid : req.uid});
    if(!data)
        return res.send(400);

    return res.json(data);
    
});

router.post('/info', async (req,res) => {
    
    let team = await C.team.get({id : req.body.id, uid : req.uid});

    let chats = await C.chat.list({tid : team._id + ''});
    let dialogs = await C.chat.list({direct : true, uid : req.uid});

    if(!dialogs)
        dialogs = [];

    for(let j = 0; j < dialogs.length; ++j)
    {
        let me = dialogs[j].members.indexOf(req.uid);
        dialogs[j].members.splice(me, 1);
    }

    let members = await C.user.get({id : team.members});
    for(let i = 0; i < members.length; ++i)
    {
        members[i].me = false;

        if(members[i]._id + '' == req.uid) {
            members[i].me = true;
        }

        members[i].exist = false;
        for(let j = 0; j < dialogs.length; ++j)
        {
            let chel = dialogs[j].members[0];
            if(chel == members[i]._id + '')
            {
                members[i].exist = true;
                members[i].direct = dialogs[j]._id;
                break;
            }
        }
    }

    res.json({chats,members});
});

router.post('/test', async (req,res) => {
    res.send('TEAM');
});

module.exports = router;