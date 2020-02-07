const base = require('./base');

module.exports = {
    insert : async (data) => {
        base.user.insertOne(data);
    }
}