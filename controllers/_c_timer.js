
let timers = {};

function start(id, key, time, func) {
    
    if(!timers[id])
        timers[id] = {};

    if(timers[id][key])
        clearTimeout(timers[id][key]);

    timers[id][key] = setTimeout(func,time);
}

function stop(id, key) {
    if(timers[uid] && timers[uid][key])
        clearTimeout(timers[id][key])
}

module.exports = {
    start,
    stop
}