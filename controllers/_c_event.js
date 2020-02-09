const $ = require('../mappers/index');

let events = [];

module.exports.listener = class Listener {
    constructor(u) {
        this.uid = u;
    }
    on(type,func){
        this['event' + type] = func;
    }
    listen() {
          
    }

}

module.exports.push = (e) => {
    events.push(e);
}