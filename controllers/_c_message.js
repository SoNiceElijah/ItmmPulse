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
            id : 'string'
        },
        ctx);

        if(!params.id)
            return false;

        if(!ctx.cids.includes(params.cid))
            return false;

        let data = await $.message.findbyChat(params.id,params.skip,params.limit);
        return data;
    },
    getOlder : async (ctx) => {
        
        let v = $v({id : 'string'}, ctx);
        if(v)
            return false;

        let { id } = v; 
        if(!id)
            return false; 
        
        return await $.message.findGT(id,ctx.cids);

    },
    get : async (ctx) => {

        let v = $v({id : 'string'}, ctx);
        let a = $v({id : 'array'}, ctx);

        if(!v && !a)
            return false;

        if(v.id)
        {
            let msg = await $.message.find(v.id);
            if(!msg)
                return false;

            if(!ctx.cids.includes(msg.cid))
                return false;
            
            return msg;
        }
        else if(a.id)
        {
            let msgs = await $.message.findMany(a.id);
            if(!msgs || msgs.lenght == 0)
                return false;
            
            msgs = msgs.filter(e => ctx.includes(e.cid));

            if(msgs.lenght == 0)
                return false;

            return msgs;
        }
        else
        {
            return false;
        }

    }
}