const express = require('express')
const app = require('../app')

let router = express.Router()

router.get('/', (req, res) => {
	res.render('index');
})

module.exports = router;