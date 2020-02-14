const $ = require('../mappers/index');
const $v = require('../ulils/dataChecker');
const $m = require('../models/index');

module.exports = {
    new : async (ctx) => {
        let team = $v($m.team,ctx);

        if(!team)
            return false;

        let cid = await $.chat.create({
            name : "main",
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
    },
    name : async (ctx) => {
        let name = $v({name : 'string'},ctx).name;
        if(!name)
            return false;

        return await $.team.findByName(name);
    }
}