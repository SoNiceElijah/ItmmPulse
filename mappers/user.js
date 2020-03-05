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

            color : ColorLuminance(Math.floor(Math.random()*16777215).toString(16),0.4),

            chat_ids : [],
            team_ids : []
        }

        base.user.insertOne(user);
        return user._id + "";
    },
    find : async (uid) => {
        return await base.user.findOne({_id : oid(uid)});
    },
    findMany : async (uids) => {
        uids = uids.map(e => oid(e));
        return await base.user.find({_id : { $in : uids} }).toArray();
    },
    findByUsername : async (username) => {
        return await base.user.findOne({username : username});
    },
    delete : async (uid) => {
        base.user.deleteOne({_id : oid(uid)});
    },
    updateChats : async (uid,cids) => {
        base.user.updateOne({_id : oid(uid)},{$set : {chat_ids : cids}});
    },
    updateTeams : async (uid,tids) => {
        base.user.updateOne({_id : oid(uid)},{$set : {team_ids : tids}});
    },
    checkPassword : async (username, password) => {
        let u = await await base.user.findOne({username : username});

        if(!u)
            return null;

        let h = crypto.createHmac('sha256',u.salt)
        .update(password)
        .digest('hex');

        if(h == u.hash)
            return u._id + '';
        else
            return null;
    }
}

function ColorLuminance(hex, lum) {

    // validate hex string
    hex = String(hex).replace(/[^0-9a-f]/gi, '');
    if (hex.length < 6) {
        hex = hex[0]+hex[0]+hex[1]+hex[1]+hex[2]+hex[2];
    }
    lum = lum || 0;

    // convert to decimal and change luminosity
    let rgb = "#", c, i;
    for (i = 0; i < 3; i++) {
        c = parseInt(hex.substr(i*2,2), 16);
        c = Math.round(Math.min(Math.max(0, c + (c * lum)), 255)).toString(16);
        rgb += ("00"+c).substr(c.length);
    }

    return rgb;
}