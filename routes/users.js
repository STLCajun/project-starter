let express = require('express')
let users = require('../controllers/users')
let bodyParser = require('body-parser')

let router = express.Router()
let jsonParser = bodyParser.json()
let urlencodedParser = bodyParser.urlencoded({ extended: false })

router.get('/login', (req, res) => {
	res.render('login');
});

module.exports = router;