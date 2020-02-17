const __mainpath = require('path').dirname(require.main.filename);

const express = require('express');
const app = express();

const bp = require('body-parser');
const cp = require('cookie-parser');

var C = require('../controllers/index');

app.set('views', __dirname + '/views');
app.set('view engine','pug');

app.use(bp({ extended: false }));
app.use(cp());
app.use(express.static(__mainpath + '/public'));

app.use(async (req,res,next) => {

    let c = await C.connection.check({...req.body, ...req.cookies });

    if(!c)
    {
        if(req.originalUrl === '/' || req.originalUrl === '/reg')
        {
            next();
        }
        else
        {
            res.redirect('/');
        }
    }
    else
    {
        next();
    }
});

app.get('/', async (req,res) => {
    res.render('index',{ hello : 'Hello World!'});
});

app.get('/reg', async(req,res) => {
    res.render('register');
});

app.get('/test', async (req,res) => {
    res.send("LOL");
});

module.exports = app;

