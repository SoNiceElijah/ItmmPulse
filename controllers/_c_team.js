const $ = require('../mappers/index');
const $v = require('../ulils/dataChecker');
const $m = require('../models/index');

module.exports = {
    new : async (ctx) => {
        let team = $v($m.team,ctx);

        if(!team)
            return false;

        let cid = $.chat.create({
            name : "Main",
            members : team.members,

            direct : false
        });

        team.cids = [cid];
        $.team.create(team);

        return true;
    },
    id : async (ctx) => {
        let tid = $v({tid : 'string'},ctx).tid;

        if(!tid)
            return false;

        return await $.team.find(tid);
    },
    teams : async (ctx) => {
        let tid = $v({tid : 'string'},ctx).tid;

        if(!tid)
            return false;

        return await $.team.findByMember(tid);
    }
}