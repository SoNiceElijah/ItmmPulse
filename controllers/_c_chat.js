const $ = require('../mappers/index');
const $v = require('../ulils/dataChecker');
const $m = require('../models/index');

const info = require('./_c_state');
const event = require('./_c_event');
const timer = require('./_c_timer');

module.exports = {
    new : async (ctx) => {

        let clear = $v($m.chat,ctx);

        if(!clear)
            return false;

        clear.direct = false;

        let cid = $.chat.create(clear);
        clear = $v({tid : 'string'},ctx);
        if(!clear)
            return false;
        
        let tid = clear.tid;
        if(!tid)
            return false;

        let team = await $.team.find(tid);

        if(!team)
            return false;

        if(!team.members.includes(ctx.uid))
            return false;

        let cids = team.chat_ids;
        cids.push(cid);

        $.team.updateChats(tid, cids);

        return true;
    },
    id : async (ctx) => {
        let v = $v({ id : 'string'}, ctx);
        if(!v)
            return false;

        let { id } = v;

        let chat =  await $.chat.find(id);
        if(!chat)
            return false;

        return chat;
    },
    list : async (ctx) => {

        let v = $v({ tid : 'string', direct : 'boolean'},ctx);

        if(!v)
            return false;

        let { tid, direct } = v;

        if(tid)
        {
            let team = await $.team.find(tid);
            if(!team)
                return false;

            let res = [];
            for(let i = 0; i < team.chat_ids.length; ++i)
            {
                res.push(await $.chat.find(team.chat_ids[i]));
            }

            return res;
        }
        else if(direct)
        {
            let chats = await $.chat.findDialogs(ctx.uid);
            return chats;
        }
        else
            return false;
    },
    check : async (ctx) => {
        let v = $v({ id : 'string'}, ctx);
        if(v.id)
            return false;

        let chat = await $.chat.find(v.id);
        if(!chat)
            return false;

        if(!chat.members.includes(ctx.uid))
            return false;

        return true;

    },
    setWriter : async (ctx) => {
        let v = $v({ id : 'string', state : 'boolean'},ctx);

        if(!v)
            return false;

        let { id, state } = v;
        if(!id)
            return false;

        if(state === undefined || state === null)
            return false;

        let chat = await module.exports.id({ id : v.id});
        if(!chat.members.includes(ctx.uid))
            return false;
    
        
        let addWriter = (chatInfo) => {

            if(!chatInfo.writers)
                chatInfo.writers = [];

            if(!chatInfo.writers.includes(ctx.uid))
                chatInfo.writers.push(ctx.uid);

            let i = chat.members.length;
            while(i--)
            {
                event.push({
                    uid : chat.members[i],
                    type : 'writing',
                    content : {
                        members : chatInfo.writers,
                        cid : chatInfo.id
                    }
                });
            }

            return chatInfo;
        };

        let removeWriter = (chatInfo) => {

            if(!chatInfo.writers)
                chatInfo.writers = [];

            if(chatInfo.writers.includes(ctx.uid))
            {
                for(let i = 0; i < chatInfo.writers.length; ++i)
                {
                    if(chatInfo.writers[i] === ctx.uid) 
                    {
                        chatInfo.writers.splice(i,1);
                        break;
                    }
                }


                let i = chat.members.length;
                while(i--)
                {
                    event.push({
                        uid : chat.members[i],
                        type : 'writing',
                        content : {
                            members : chatInfo.writers,
                            cid : chatInfo.id
                        }
                    });
                }
            }                   

            return chatInfo;
        };

    
        if(state)
        {
            info.setChatState(id,addWriter);
            timer.start(ctx.uid, 15, 30 * 1000, () => { info.setChatState(id,removeWriter) });
        }
        else
        {
            info.setChatState(id,removeWriter);        
            timer.stop(ctx.uid, 15);
        }

        return true;
    }
};