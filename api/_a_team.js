var express = require('express');
var router = express.Router();


router.post('/test', async (req,res) => {
    res.send('TEAM');
});

module.exports = router;