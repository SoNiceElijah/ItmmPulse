const $ = require('../mappers/index');
const $v = require('../ulils/dataChecker');

module.exports = {
    open : async (ctx) => {

        let clear = $v({username : 'string', password : 'string'}, ctx);
        if(!clear)
            return false;
        
        let uid = await $.user.checkPassword(clear.username, clear.password);
        if(!uid)
            return false;
        
        return await $.connection.create(uid,ctx.ip,ctx.device);
    },

    close : async (ctx) => {

        if(!(ctx.token && typeof ctx.token == 'string'))
            return false;

        $.connection.drop(ctx.token);
        return true;
    },
    check : async (ctx) => {
        if(!(ctx.token && typeof ctx.token == 'string'))
            return false;

        let c = await $.connection.find(ctx.token);

        if(!c)
            return false;
        
        return c;
    }
}