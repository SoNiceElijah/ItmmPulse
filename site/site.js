const __mainpath = require('path').dirname(require.main.filename);

const express = require('express');
const app = express();

const bp = require('body-parser');
const cp = require('cookie-parser');

app.set('views', __dirname + '/views');
app.set('view engine','pug');

app.use(bp({ extended: false }));
app.use(cp());
app.use(express.static(__mainpath + '/public'));

app.get('/', async (req,res) => {
    res.render('index',{ hello : 'Hello World!'});
});

module.exports = app;

