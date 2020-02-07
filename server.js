
let main = async () => {

    const connect = require('./mappers/base');
    await connect();

    //Now connected
    const $ = require('./mappers/index');
    $.connection.create();
    
}


main();