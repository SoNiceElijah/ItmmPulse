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

app.use(bp.json());
app.use(cp());
app.use(express.static(__mainpath + '/public'));

app.use(r_connection);

app.use('/chat', r_chat);
app.use('/message', r_message);
app.use('/team', r_team);
app.use('/user', r_user);

module.exports = app;

