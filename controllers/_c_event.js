let events = [];

let portal = {};

module.exports.on = (name, func) => {

    if(!portal[name])
    {
        portal[name] = []
    }

    portal[name].push(func);
}

module.exports.push = (e) => {
    events.push(e);
}

let interval = setInterval(() => {
    while(events.length > 0)
    {
        let obj = events[0];
        let arr = events.filter((item) => item.uid == obj.uid);

        let tmp = arr.map(e => e.type); 
        arr = arr.filter((v,i) => tmp.indexOf(v.type) === i);

        events = events.filter((item) => item.uid != obj.uid);

        if(portal['event' + arr[0].uid] && portal['event' + arr[0].uid].length != 0) 
        {
            for(let i = 0; i < portal['event' + arr[0].uid].length; ++i)
                portal['event' + arr[0].uid][i](arr);

            delete portal['event' + arr[0].uid];
        }
        
        for(let i = 0; i < arr.length; ++i) {
            if(portal[arr[i].type + "" + arr[i].uid] && portal[arr[i].type + "" + arr[i].uid].length != 0)
            {
                for(let j = 0; j < portal[arr[i].type + "" + arr[i].uid].length; ++j)    
                    portal[arr[i].type + "" + arr[i].uid][j](arr[i]);

                delete portal[arr[i].type + "" + arr[i].uid];
            }
        }
        
    }
}, 50);