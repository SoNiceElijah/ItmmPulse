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
        team.main = cid;

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
        let { name } = $v({name : 'string'},ctx);
        if(!name)
            return false;

        return await $.team.findByName(name);
    },
    add : async (ctx) => {
        let {tid ,uid } = $v({tid : 'string', uid : 'string'},ctx);
        if(!tid || !uid)
            return false;
        
        let team = await $.team.find(tid);
        let user = await $.user.find(uid);
        let chat = await $.chat.find(team.main);

        if(!user)
            return false;

        if(!team)
            return false;

        let tids = user.team_ids;
        tids.push(tid);
        $.user.updateTeams(uid,tids);

        let cids = user.chat_ids;
        cids.push(team.main);
        $.user.updateChats(uid,cids);

        let tmembs = team.members;
        tmembs.push(uid);
        $.team.updateMembers(tid,tmembs);

        let cmembs = chat.members;
        cmembs.push(uid);
        $.chat.updateMembers(team.main,cmembs);

        return true;
    }
}