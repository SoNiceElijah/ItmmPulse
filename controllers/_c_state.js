const $ = require('../mappers/index');

let StateStorage = [];

module.exports = {
    load : async () => {
        StateStorage = await $.state.all();
    },
    new : async (data) => {

        let sid = await $.state.create(data);
        StateStorage.push({
            _id : sid,
            ...data,
            stored : false
        })
    },
    getUserState : async (uid) => {
        return StateStorage.find(e => e.id == uid && e.type == 'user');
    },
    getChatState : async (cid) => {
        return StateStorage.find(e => e.id == cid && e.type == 'chat');
    },
    getTeamState : async (tid) => {
        return StateStorage.find(e => e.id == tid && e.type == 'team');
    },
    setUserState : async (uid, func) => {

        let state = await this.getUserState(uid);
        if(!state) {
            await this.new({ uid : uid });
            state = await this.getUserState(uid);
        }

        let index = StateStorage.indexOf(state);

        StateStorage[index] = func(state);
    },
    setChatState : async (cid, func) => {

        let state = await this.getChatState(cid);
        if(!state) {
            await this.new({ cid : cid });
            state = await this.getChatState(cid);
        }

        let index = StateStorage.indexOf(state);

        StateStorage[index] = func(state);
    },
    setTeamState : async (tid, func) => {
        
        let state = await this.getTeamState(tid);
        if(!state) {
            await this.new({ tid : tid });
            state = await this.getTeamState(tid);
        }

        let index = StateStorage.indexOf(state);

        StateStorage[index] = func(state);
    },
    store : async () => {
        for(let i = 0; i < StateStorage.length; ++i)
        {
            if(!StateStorage[i].stored)
                $.state.update(StateStorage[i]);
        }
    }
}

let interval = setInterval(() => {
    module.exports.store();
}, 2 * 60 * 1000)