const base = require('./base');

module.exports = {
    insert : async (data) => {
        base.connection.insertOne(data);
    }
}