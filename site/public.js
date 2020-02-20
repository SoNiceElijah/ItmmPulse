const express = require('express');
const router = express.Router();

var C = require('../controllers/index');

router.get('/', async (req,res) => {
    if(!req.user)
        res.render('index',{ hello : 'Hello World!'});
    else
        res.render('page');
});

router.get('/reg', async(req,res) => {

    if(req.user)
        res.redirect('/');
    else
        res.render('register');
});

router.get('/test', async (req,res) => {
    res.send("LOL");
});

module.exports = router;