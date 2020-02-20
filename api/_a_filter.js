const express = require('express');
const router = express.Router();

router.use((req,res,next) => {
    if(!req.user)
        res.send(401);
    else
        next();
});

module.exports = router;  