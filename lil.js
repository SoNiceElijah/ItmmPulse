//Hi! I'm simple deploy bot

const express = require('express');
const router = express.Router();
const cmd = require('node-cmd');

router.post('/updatePulse', (req,res) => {
    

    if(req.body.ref === 'refs/heads/master')
    {
        cmd.get(`
            git fetch --all
            git reset --hard origin/master
            npm i
            pm2 reload server
        `,(err,data) => {
            if(!err)
            {
                res.send(data);
            }
            else
            {
                res.sendStatus(500);
            }

        })
    }
    else
    {
        res.send("Update isn't necessary");
    }

})

//develop push test
module.exports = router;