const base = require('./base');
const time = require('../ulils/dateConverter');

const oid = require('mongodb').ObjectId;

module.exports = {
    create : async (data) => {

        if(!data._id)
            data._id = new oid();

        base.state.insertOne(data);
        return data._id + '';
    },
    all : async () => {
        return await base.state.find({}).toArray();  
    },
    find : async(id) => {
        return await base.state.findOne({_id : oid(id)});
    },
    update : async(data) => {
        base.state.updateOne({_id : oid(data._id)},{ $set: { ...data}});
    }
};