const __mainpath = require('path').dirname(require.main.filename);

const express = require('express');
const app = express();

const bp = require('body-parser');
const cp = require('cookie-parser');

const r_chat = require('./_a_chat');
const r_connection = require('./_a_connection');
const r_message = require('./_a_message');
const r_team = require('./_a_team');
const r_user = require('./_a_user');
const r_filter = require('./_a_filter');

const site = require('../site/site');


//MESURE
let reqNum = 0;
const { performance } = require('perf_hooks');
app.use((req,res,next) => {

    let lockNum = reqNum++;
    let t1 = performance.now();
    console.log(`${lockNum} ${req.method} ${req.originalUrl} %c[STARTED]`,'color : #2643b5');

    res.on('finish', () => {            
        let t2 = performance.now();
        console.log(`${lockNum} ${req.method} ${req.originalUrl} in ${t2 - t1}ms %c[FINISHED]  `,'color : #24bf50');
    })

    res.on('close', () => {
        let t2 = performance.now();
        console.log(`${lockNum} ${req.method} ${req.originalUrl} in ${t2 - t1}ms %c[CLOSED] `,'color : #bf3e24');
    })

    next();
});

app.use(bp.json());
app.use(cp());

app.use(require('../lil'));

let USE_REACT_DEV = false;
if(USE_REACT_DEV)
    app.use(express.static(__mainpath + '/application/public'));
else
    app.use(express.static(__mainpath + '/public'));

app.use(r_connection);

app.use(site.public);
app.use(r_filter);

const api = express.Router();

api.use('/chat', r_chat);
api.use('/message', r_message);
api.use('/team', r_team);
api.use('/user', r_user);

app.use('/api',api);

app.use(function(err, req, res, next) {
    console.error(err);
    res.sendStatus(500);
});

module.exports = app;

