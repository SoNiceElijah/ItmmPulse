const $ = require('../mappers/index');
const $v = require('../ulils/dataChecker');
const $m = require('../models/index');

const events = require('./_c_event');

const time = require('../ulils/dateConverter');

module.exports = {
    send : async (ctx) => {
        let msg = $v($m.message, ctx);
        msg.date = time.toUTC(new Date());
        msg.uid = ctx.uid;

        let chat = (await $.chat.find(msg.cid))
        if(!chat)
            return false;

        if(!chat.members.includes(msg.uid))
            return false;

        $.message.insert(msg);
        let memb = chat.members;

        for(let i = 0; i < memb.length; ++i)
            events.push({
                uid : memb[i],
                type : 'message',
                content : msg
            });

        return true;
    },
    sendToUser : async (ctx) => {
        let msg = $v($m.message, ctx);
        msg.date = time.toUTC(new Date());
        msg.uid = ctx.uid;

        if(!(await $.user.find(msg.cid)))
            return false;

        let dir = await $.chat.findDirect([msg.cid, msg.uid]);

        if(!dir) 
        {
            dir = {}
            dir._id = await $.chat.create({
                name : `DIRECT${msg.cid}${msg.uid}`,
                members : [msg.cid, msg.uid],
                direct : true
            });

            let u1 = await $.user.find(msg.cid);
            let u2 = await $.user.find(msg.uid);

            let m1 = u1.chat_ids;
            m1.push(dir._id + '');
            $.user.updateChats(u1._id + '',m1);

            let m2 = u2.chat_ids;
            m2.push(dir._id + '');
            $.user.updateChats(u2._id + '',m2);
        }

        events.push({
            uid : msg.cid,
            type : 'message'
        });
        events.push({
            uid : msg.uid,
            type : 'message'
        });
        
        msg.cid = dir._id + '';
        $.message.insert(msg);

        return dir._id + '';

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

        if(!ctx.cids.includes(params.id))
            return false;

        let data = await $.message.findbyChat(params.id,params.skip,params.limit);
        return data;
    },
    getUserHistory : async (ctx) => {
        let params = $v({
            limit : 'number'
        },
        ctx);

        if(!params)
            params = { limit : 1 };
        else if(!params.limit)
            params = { limit : 1 }; 
        
        let data = await $.message.findbyUser(ctx.cids, null, params.limit);
        return data;
    },
    getOlder : async (ctx) => {
        
        let v = $v({id : 'string'}, ctx);
        if(!v)
            return false;

        let { id } = v; 
        if(!id)
            return false; 

        let target = await $.message.find(id);
        if(!target)
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