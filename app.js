require('./config/config')
const Rollbar = require("rollbar")
const express = require('express')
const nunjucks = require('nunjucks')
const _ = require('lodash')
const {mongoose} = require('./db/mongoose')
const path = require('path')
const jwt = require('jsonwebtoken')
const moment = require('moment')
const passport = require('passport')
const flash    = require('connect-flash')
const morgan   = require('morgan')
const cookieParser = require('cookie-parser')
const bodyParser = require('body-parser')
const session    = require('express-session')

const rollbar = new Rollbar({
	accessToken: process.env.ROLLBAR_TOKEN,
	captureUncaught: true,
	captureUnhandledRejections: true
});

let routes = require('./routes/routes')
let users = require('./routes/users')

let app = express();

app.use(session({
	secret: 'secret',
	saveUninitialized: true,
	resave: true
}))

app.use(require('connect-livereload')());
app.use(express.static( path.join(__dirname, '/public')))

nunjucks.configure('views', {
    autoescape: true,
    express: app
});

app.set('view engine', 'html');

app.use(morgan('dev')); // log every request to the console
app.use(cookieParser()); // read cookies (needed for auth)
app.use(bodyParser()); // get information from html forms
app.use(session({ secret: 'ilovescotchscotchyscotchscotch' }));
app.use(passport.initialize());
app.use(passport.session()); // persistent login sessions
app.use(flash()); // use connect-flash for flash messages stored in session

app.use((req, res, next) => {
	res.locals.success_msg = req.flash('success_msg');
	res.locals.error_msg = req.flash('error_msg');
	res.locals.error = req.flash('error');
	res.locals.user = req.user || null;
	next();
})

// Route Use
app.use('/', routes);
app.use('/users/', users);

app.listen(process.env.PORT || 3000, function() {
	console.log('Express server listening on ' + process.env.PORT);
	console.log('running');
});

module.exports = function() {
	app
};