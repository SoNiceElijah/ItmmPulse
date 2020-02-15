const base = require('./base');
const time = require('../ulils/dateConverter');

const oid = require('mongodb').ObjectId;

module.exports = {
    create : async (data) => {
        
        let team = {
            _id : new oid(),

            name : data.name,
            members : data.members,
            create_date : time.toUTC(new Date()),

            chat_ids : data.cids,
            main : data.main
        }

        base.team.insertOne(team);
        return team._id + '';
    },
    find : async (tid) => {
        return await base.team.findOne({_id : oid(tid)});
    },
    allByMember : async (member) => {
        return await base.team.find({members : { $all : [member]}});
    },
    findByMember : async(member, skip, limit) => {
        return await base.execute('team','find skip limit', {members : { $all : [member]}}, skip, limit);
    },
    findByName : async (name) => {
        return await base.team.findOne({name : name});
    },
    updateName : async (tid, name) => {
        base.team.updateOne({_id : oid(tid)},{name : name});
    },
    updateMembers : async (tid, members) => {
        base.team.updateOne({_id : oid(tid)}, { $set : {members : members}});
    },
    updateChats : async (tid, chats) => {
        base.team.updateOne({_id : oid(tid)}, { $set : {chat_ids : chats}});
    }
};