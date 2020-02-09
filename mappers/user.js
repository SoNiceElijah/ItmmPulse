const base = require('./base');
const time = require('../ulils/dateConverter');
const crypto = require('crypto');

const oid = require('mongodb').ObjectId;

module.exports = {
    insert : async (data) => {
        base.user.insertOne(data);
    },
    create : async (data) => {
        let salt = Math.random().toString(36).substring(2, 14) + Math.random().toString(36).substring(3, 15);
        let hash = crypto.createHmac('sha256',salt)
        .update(data.password)
        .digest('hex');

        let user = {
            _id : new oid(),

            name : data.name,
            username : data.username,
            salt : salt,
            hash : hash,
            register_date : time.toUTC(new Date()),

            chat_ids : []
        }

        base.user.insertOne(user);
        return user._id + '';
    },
    find : async (uid) => {
        return await base.user.findOne({_id : oid(uid)});
    },
    findByUsername : async (username) => {
        return await base.user.findOne({username : username});
    },
    delete : async (uid) => {
        base.user.deleteOne({_id : oid(uid)});
    },
    updateChats : async (uid,cids) => {
        base.user.updateOne({_id : oid(uid)},{chat_ids = cids});
    },
    checkPassword : async (username, password) => {
        let u = await this.findByUsername(username);

        let h = crypto.createHmac('sha256',u.salt)
        .update(password)
        .digest('hex');

        if(h == u.hash)
            return u._id + '';
        else
            return null;
    }
}