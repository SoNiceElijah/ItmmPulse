const mongoClient = require('mongodb');

async function BaseMapper(_db) {

        console.log('Creating new mapper');

        let obj = {};

        obj.db = _db;
        collections = await obj.db.listCollections().toArray();

        for(let i = 0; i < collections.length; ++i)
            obj[collections[i].name] = _db.collection(collections[i].name);
            
        obj.execute = async (table, query, ...params) => {
            
            let cursor = this[table];

            let commands = query.split(' ');
            for(let i = 0; i < commands.lenght; ++i)
                if(params[i] || params[i] == 0)
                    cursor = cursor[commands[i]](params[i]);

            return await cursor.toArray();
        };


        return obj;
}


module.exports = async () => {

    let _client = await mongoClient.connect("mongodb://localhost:27017",{ useNewUrlParser: true ,useUnifiedTopology: true});
    let _db = _client.db('ItmmPulse');

    mapper = await BaseMapper(_db);

    if(!mapper.connection)
        await _db.collection('connection').insertOne({dummy : true});
    if(!mapper.user)
        await _db.collection('user').insertOne({dummy : true});
    if(!mapper.message)
        await _db.collection('message').insertOne({dummy : true});
    if(!mapper.chat)
        await _db.collection('chat').insertOne({dummy : true});
    if(!mapper.team)
        await _db.collection('team').insertOne({dummy : true});

    mapper = await BaseMapper(_db);
    module.exports = mapper;


    return mapper;
}


