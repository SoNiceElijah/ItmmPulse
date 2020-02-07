const $ = require('../mappers/index');

module.exports = {
    open : async (ctx) => {

        if(!(ctx.username && typeof ctx.username == 'string'))
            return 1;
        if(!(ctx.password && typeof ctx.password == 'string'))
            return 2;
        
        let uid = await $.user.checkPassword(ctx.username, ctx.password);
        if(!uid)
            return 4;
        
        return await $.connection.create(uid,ctx.ip,ctx.device);
    },

    close : async (ctx) => {

        if(!(ctx.token && typeof ctx.token == 'string'))
            return 1;

        $.connection.drop(ctx.token);
    },
    check : async (ctx) => {
        if(!(ctx.token && typeof ctx.token == 'string'))
            return 1;

        let c = await $.connection.find(ctx.token);

        if(!c)
            return 2;
        
        return 0;
    }
}