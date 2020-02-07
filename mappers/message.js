const base = require('./base');

module.exports = {
    insert : async (data) => {
        base.message.insert(data);
    }
}