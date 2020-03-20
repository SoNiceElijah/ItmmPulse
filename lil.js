//Hi! I'm simple deploy bot

const express = require('express');
const router = express.Router();

router.post('/updatePulse', (req,res) => {
    
    console.log(req.body);
    res.sendStatus(200);

})

module.exports = router;