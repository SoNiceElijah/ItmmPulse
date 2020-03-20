//Hi! I'm simple deploy bot

const express = require('express');
const route = express.Router();

route.post('/updatePulse', (req,res) => {
    
    console.log(req.body);
    res.sendStatus(200);
    
})

module.exports = route;