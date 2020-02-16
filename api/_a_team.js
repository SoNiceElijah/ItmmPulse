var express = require('express');
var router = express.Router();

const C = require('../controllers/index');

router.post('/get', async (req,res) => {

    if(req.body.uid)
        delete req.body.uid;
 
    let data = await C.team.get({ ...req.body, uid : req.uid});
    if(!data)
        return res.send(400);

    return res.json(data);
    
});

router.post('/test', async (req,res) => {
    res.send('TEAM');
});

module.exports = router;