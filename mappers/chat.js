const base = require('./base');
const time = require('../ulils/dateConverter');

const oid = require('mongodb').ObjectId;

module.exports = {
    insert : async (data) => {
        base.chat.insert(data);
    },
    create : async (data) => {

        let chat = {
            name : data.name,
            members : data.members,
            create_date : time.toUTC(new Date())
        };

        base.chat.insertOne(chat);
    },
    find : async (cid) => {
        return await base.chat.findOne({_id : oid(cid)});
    },
    all : async () => {
        return await base.chat.find({}).toArray();
    },
    updateMembers : async (cid, members) => {
        base.chat.updateOne({_id : cid},{members : members});
    },
    updateName : async (cid, name) => {
        base.chat.updateOne({_id : oid(cid)}, {name : name});
    },
    delete : async (cid) => {
        base.chat.deleteOne({_id : oid(cid)});
    }
}