const base = require('./base');
const time = require('../ulils/dateConverter');

const oid = require('mongodb').ObjectId;

module.exports = {
    insert : async (data) => {
        base.chat.insert(data);
    },
    create : async (data) => {

        let chat = {
            _id : new oid(),

            name : data.name,
            members : data.members,
            create_date : time.toUTC(new Date()),

            direct : data.direct
        };

        base.chat.insertOne(chat);
        return chat._id + "";
    },
    find : async (cid) => {
        return await base.chat.findOne({_id : oid(cid)});
    },
    findMany : async(cids) => {
        cids = cids.map(cid => oid(cid));
        return await base.chat.find({_id : {$in : cids}}).toArray();
    },
    all : async () => {
        return await base.chat.find({}).toArray();
    },
    updateMembers : async (cid, members) => {
        base.chat.updateOne({_id : oid(cid)},{ $set : {members : members}});
    },
    updateName : async (cid, name) => {
        base.chat.updateOne({_id : oid(cid)}, {name : name});
    },
    delete : async (cid) => {
        base.chat.deleteOne({_id : oid(cid)});
    },
    findDirect : async (members) => {
        return await base.chat.findOne({members : {$all : members}, direct : true});
    },
    findDialogs : async (uid) => {
        return await base.chat.find({members : {$in : [uid]}, direct : true}).toArray();
    }
}