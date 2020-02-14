const $ = require('../mappers/index');
const $v = require('../ulils/dataChecker');
const $m = require('../models/index');

const events = require('./_c_event');

const time = require('../ulils/dateConverter');

module.exports = {
    send : async (ctx) => {
        let msg = $v($m.message, ctx);
        msg.date = time.toUTC(new Date());

        let chat = (await $.chat.find(msg.cid))
        if(!chat)
            return false;

        if(!chat.members.includes(msg.uid))
            return false;

        $.message.insert(msg);
        let memb = chat.members;

        for(let i = 0; i < memb.lenght; ++i)
            events.push({
                uid : memb[i],
                type : 'message'
            });

        return true;
    },
    sendToUser : async (ctx) => {
        let msg = $v($m.message, ctx);

        if(!(await $.user.find(msg.cid)))
            return false;

        let cid = await $.chat.findDirect([msg.cid, msg.uid]).cid;
        if(!cid) 
        {
            cid = $.chat.create({
                name : `DIRECT${msg.cid}${msg.uid}`,
                members : [msg.cid, msg.uid],
                direct : true
            });
        }
        
        msg.cid = cid;
        $.message.insert(msg);

        return true;

    },
    getHistory : async (ctx) => {
        let params = $v({
            skip : 'number',
            limit : 'number',
            cid : 'string'
        },
        ctx);

        if(!params.cid)
            return false;

        let chat = await $.chat.find(params.cid);

        if(!chat)
            return false;

        if(!chat.members.includes(ctx.uid))
            return false;

        let data = await $.message.findbyChat(params.cid,params.skip,params.limit);
        return data;
    },
    getOlder : async (mid, chats) => {
        return await $.message.findGT(mid,chats);
    }
}