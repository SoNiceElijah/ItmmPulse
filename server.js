let main = async () => {

    const connect = require('./mappers/base');
    let db = await connect();

    const api = require('./api/api');
    const site = require('./site/site');

    api.listen(4100,() => {
        console.log('API online');
    })

    site.listen(4000, () => {
        console.log('SITE online');
    })
    
}


main();