//Hi! I'm simple deploy bot

const express = require('express');
const router = express.Router();
const cmd = require('node-cmd');

router.post('/updatePulse', (req,res) => {
    

    if(req.body.ref === 'refs/heads/master')
    {
        cmd.run(`
            git fetch --all
            git reset --hard origin/master
            npm i
            pm2 reload server
        `);

        res.send("Updating...");
    }
    else
    {
        res.send("Update isn't necessary");
    }

})

//Check new rule
module.exports = router;