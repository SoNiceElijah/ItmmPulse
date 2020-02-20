const $ = require('../mappers/index');
const $v = require('../ulils/dataChecker');
const $m = require('../models/index');

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

    }
    
};