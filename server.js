let main = async () => {

    const connect = require('./mappers/base');
    let db = await connect();

    const app = require('./api/app');

    app.listen(4000,() => {
        console.log('APP online');
    })    
}


main();