const express = require('express');
const router = express.Router();

const __mainpath = require('path').dirname(require.main.filename);

var C = require('../controllers/index');

router.get('/', async (req,res) => {
    res.sendFile(__mainpath + '/public/index.html');
});

module.exports = router;