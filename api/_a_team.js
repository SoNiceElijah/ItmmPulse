var express = require('express');
var router = express.Router();

router.post('/get', async (req,res) => {

});

router.post('/test', async (req,res) => {
    res.send('TEAM');
});

module.exports = router;