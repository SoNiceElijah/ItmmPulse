const $ = require('../mappers/index');
const $v = require('../ulils/dataChecker');
const $m = require('../models/index');

module.exports = {
    register : async (ctx) => {

        let clear = $v($m.user,ctx);
        if(!clear)
            return false;

        if(!clear.username)
            return false;
        
        if(!clear.password)
            return false;
        
        if(!clear.name)
            return false;

        let check = await $.user.findByUsername(clear.username);
        if(check)
            return false;

        let uid = await $.user.create(clear);
        return uid + '';

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
    get : async (ctx) => {
        let v = $v({id : 'string', username : 'string'},ctx);
        let a = $v({id : 'array'}, ctx);

        if(!v && !a)
            return false;

        let { id , username} = v;

        if(id)
        {
            let user = await $.user.find(id);
            if(!user)
                return false;
    
            delete user.salt;
            delete user.hash;
            return user;
        }
        else if(username)
        {
            let user = await $.user.findByUsername(username);
            if(!user)
                return false;
    
            delete user.salt;
            delete user.hash;
            return user;
        }
        else if(a.id) {
            let users = await $.user.findMany(a.id);
            if(!users || users.length == 0)
                return false;
            
            users = users.map(e => {
                delete e.salt;
                delete e.hash;

                return e;
            });
            return users;
        }
        else
            return false;
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