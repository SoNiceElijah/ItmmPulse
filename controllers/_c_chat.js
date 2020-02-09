const $ = require('../mappers/index');
const $v = require('../ulils/dataChecker');
const $m = require('../models/index');

module.exports = {
    new : async (ctx) => {

        let clear = $v($m.chat,ctx);
        clear = {
            ...clear,
            direct : false
        }

        if(!clear)
            return false;

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

        let cids = team.chat_ids;
        cids.push(cid);

        $.team.updateChats(tid, cids);

        return true;
    },
    id : async (cid) => {
        return await $.chat.find(cid);
    },
    
};