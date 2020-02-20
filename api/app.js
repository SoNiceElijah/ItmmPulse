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

app.set('views', __mainpath + '/site/views');
app.set('view engine','pug');

app.use(bp.json());
app.use(cp());
app.use(express.static(__mainpath + '/public'));
app.use(express.static(__mainpath + '/site/view/public'));

app.use(r_connection);

app.use(site.public);
app.use(r_filter);
app.use('/application',site.private);

const api = express.Router();

api.use('/chat', r_chat);
api.use('/message', r_message);
api.use('/team', r_team);
api.use('/user', r_user);

app.use('/api',api);

module.exports = app;

