let newEvents = [];
let historyEvents = [];

let portal = {};

let help = require('../ulils/dateConverter');

module.exports.on = (name, func) => {

    if(!portal[name])
    {
        portal[name] = []
    }

    portal[name].push(func);
}

module.exports.push = (e) => {
    newEvents.push({
        ...e,
        ts : help.now()
    });
}

module.exports.getOlder = (ts,uid) => {
    if(uid)
    {
        return historyEvents.filter(e => e.ts > ts && e.uid == uid)
    }
    else
    {
        return historyEvents.filter(e => e.ts > ts);
    }
};

let interval = setInterval(() => {
    while(newEvents.length > 0)
    {
        let obj = newEvents[0];
        let allEvents = newEvents.filter((item) => item.uid == obj.uid);

        let types = newEvents.map(e => e.type);
        let typeEvents = [];
        for(let i = 0; i < types.length; ++i)
            typeEvents.push([]);

        for(let i = 0; i < newEvents.length; ++i)
        {
            let o = newEvents[i];
            typeEvents[types.indexOf(o.type)].push(o);
        }

        newEvents = newEvents.filter((item) => item.uid != obj.uid);

        let riseId = 'event' + allEvents[0].uid;
        let riseFuncArray = portal[riseId];

        if(riseFuncArray && riseFuncArray.length != 0) 
        {
            for(let i = 0; i < riseFuncArray.length; ++i)
                riseFuncArray[i](allEvents);

            delete portal['event' + allEvents[0].uid];
        }

      
        
        for(let i = 0; i < typeEvents.length; ++i) {
            let riseTypeId = typeEvents[i][0].type + "" + typeEvents[i][0].uid;
            let riseTypeFuncArray = portal[riseTypeId];
            
            if(riseTypeFuncArray && riseTypeFuncArray.length != 0)
            {
                for(let j = 0; j < riseTypeFuncArray.length; ++j)    
                    riseTypeFuncArray[j](typeEvents[i]);

                delete portal[typeEvents[i][0].type + "" + typeEvents[0][i].uid];
            }
        }

        allEvents = allEvents.filter(e => e.type != 'none');
        historyEvents = historyEvents.concat(allEvents);        
    }
}, 50);

let checkTS = help.now() - 10 * 1000 * 60;
let superInterval = setInterval(() => {

    historyEvents = historyEvents.filter(e => e.ts >= checkTS);
    checkTS = help.now();

},10 * 1000 * 60)