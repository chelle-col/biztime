const db = require("../db");

const express = require('express');
const router = express.Router()

router.get('/', (req, res)=>{
    return res.send('Working');
})

module.exports = router;