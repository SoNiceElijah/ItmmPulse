var express = require('express');
var router = express.Router();


router.post('/test', async (req,res) => {
    res.send('CHAT');
});

module.exports = router;