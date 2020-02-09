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

            chat_ids = []
        }

        base.team.insertOne(team);
        return team._id + '';
    },
    find : async (tid) => {
        return await base.team.findOne({_id : oid(tid)});
    },
    allByMember : async (member) => {
        return await base.team.find({members : { $in : [member]}});
    },
    findByMember : async(member, skip, limit) => {
        return await base.execute('team','find skip limit', {members : { $in : [member]}}, skip, limit);
    },
    updateName : async (tid, name) => {
        base.team.updateOne({_id : oid(tid)},{name : name});
    },
    updateMembers : async (tid, members) => {
        base.team.updateOne({_id : oid(tid)}, {members : members});
    },
    updateChats : async (tid, chats) => {
        base.team.updateOne({_id : oid(tid)}, {chat_ids : chats});
    }
};