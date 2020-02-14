const $ = require('../mappers/index');
const $v = require('../ulils/dataChecker');
const $m = require('../models/index');

module.exports = {
    register : async (ctx) => {

        let clear = $v($m.user,ctx);
        if(!clear)
            return false;

        $.user.create(clear);
        return true;

    },
    id : async (id) => {
        if(!id)
            return null;
        
        return await $.user.find(id);
    },
    username : async (username) => {
        if(!username)
            return null;

        return await $.user.findByUsername(username);
    },
    chats : async (uid) => {

        if(!uid)
            return null;

        let u = await $.user.find(uid);
        
        if(!u)
            return false

        let c = []
        for(let i = 0; i < u.chat_ids; ++i)
        {
             c.push(await $.chat.find(u.chat_ids[i]));
        }

        return c;
    }
}