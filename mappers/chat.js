const base = require('./base');

module.exports = {
    insert : async (data) => {
        base.chat.insert(data);
    }
}