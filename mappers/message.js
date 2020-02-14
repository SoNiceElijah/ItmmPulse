const base = require('./base');
const time = require('../ulils/dateConverter');

const oid = require('mongodb').ObjectId;

module.exports = {
    insert : async (data) => {

        let message = {
            _id : new oid(),

            uid : data.uid,
            cid : data.cid,
            msg : data.msg,
            date : data.date
        }

        base.message.insertOne(message);
        return message._id + '';
    },
    find : async (mid) => {
        return await base.message.findOne({_id : oid(mid)});
    },
    allByChat : async (cid) => {
        return await base.message.find({cid : cid }).toArray();
    },
    findbyChat : async (cid, skip, limit) => {
        return await base.execute('user','find skip limit', {cid : cid}, skip, limit);
    },
    allByUser : async (uid) => {
        return await base.message.find({uid : uid }).toArray();
    },
    findbyUser : async (uid, skip, limit) => {
        return await base.execute('user','find skip limit', {uid : uid}, skip, limit);
    },
    findGT : async (mid, cids) => {
        return await base.message.find({_id : {$gt : oid(mid)}, cid : {$in : cids}}).toArray();
    }
}