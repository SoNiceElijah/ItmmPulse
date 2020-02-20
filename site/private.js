const express = require('express');
const router = express.Router();

const time = require('../ulils/dateConverter');

var C = require('../controllers/index');

router.get('/npPage', async (req,res) => {
    res.render('pages/inprogress');
});

router.get('/mpPage', async (req,res) => {
    res.render('pages/inprogress');
});

router.get('/cpPage', async (req,res) => {
    
    let team = await C.team.get({id : req.user.team_ids[0], uid : req.uid});

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

    res.render('pages/chat',{chats, members});
});

router.get('/tpPage', async (req,res) => {
    res.render('pages/inprogress');
});



//PARTIALS

router.get('/loadMsgs', async (req,res) => { 

    let id = req.query.id;
    let page = req.query.page;
    let size = req.query.size;
    let offset = req.query.offset;

    let model = {}

    if(id)
    {
        if(id === "lol")
            return res.render('pages/partials/messagePanel',{
                empty : false,
                msgs : []
            });

        if(!page)
            page = 0;
        
        if(!offset)
            offset = 0;

        if(!size) 
            size = 20;

        let msgs = await C.message.getHistory({
            id : id,

            skip : page * size + offset,
            limit : size,

            cids : req.user.chat_ids
        });


        for(let i = 0; i < msgs.length; ++i)
        {
            let user = await C.user.get({ id :msgs[i].uid});
            msgs[i].from = user.name;
            msgs[i].date = time.normalStringTime(msgs[i].date);

            msgs[i].me = req.uid == msgs[i].uid
        }

        msgs.reverse();
        model.msgs = msgs;
    }
    else
    {
        model.empty = true;
    }


    res.render('pages/partials/messagePanel',model);
});

router.post('/loadMsgsUpdates', async (req,res) => {

    let id = req.body.id;
    let model = {}

    if(id)
    {
        let msgs = await C.message.getOlder({
            id : id,
            cids : req.user.chat_ids
        });

        if(msgs === false)
            return res.send(400);
        
        if(!msgs || msgs.length == 0)
        {
            C.event.on('message' + req.uid, async (e) =>{
                msgs = await C.message.getOlder({
                    id : id,
                    cids : req.user.chat_ids
                });

                for(let i = 0; i < msgs.length; ++i)
                {
                    let user = await C.user.get({ id :msgs[i].uid});
                    msgs[i].from = user.name;
                    msgs[i].date = time.normalStringTime(msgs[i].date);

                    msgs[i].me = req.uid == msgs[i].uid
                }

                msgs.reverse();
                model.msgs = msgs;

                res.render('pages/partials/messages',model);

            });
        }
        else
        {
            for(let i = 0; i < msgs.length; ++i)
            {
                let user = await C.user.get({ id :msgs[i].uid});
                msgs[i].from = user.name;
                msgs[i].date = time.normalStringTime(msgs[i].date);

                msgs[i].me = req.uid == msgs[i].uid
            }

            msgs.reverse();
            model.msgs = msgs;

            res.render('pages/partials/messages',model);
        }
    }
    else
    {
        model.msgs = [];
        res.render('pages/partials/messages',model);
    }    
}); 



module.exports = router;