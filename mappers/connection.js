const base = require('./base');
const time = require('../ulils/dateConverter');

const crypto = require('crypto');

module.exports = {
    insert : async (data) => {
        base.connection.insertOne(data);
    },
    create : async (uid, ip, device) => {
        let salt = Math.random().toString(36).substring(2, 14) + Math.random().toString(36).substring(3, 15);
        let token = crypto.createHmac('sha256',salt)
        .update(new Date().toISOString())
        .digest('hex');

        let connection = {
            token : token,
            uid : uid,
            date : time.toUTC(new Date()),
            ip : ip,
            device : device
        };

        base.connection.insertOne(connection);

        return token;
    },
    find : async (token) => {
        return await base.connection.findOne({token : token});
    },
    drop : async (token) => {
        base.connection.deleteOne({token : token});
    }
}