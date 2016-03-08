// BASE SETUP
///////////////////////////////////////////////////////////////////////////////////////////////////

// CALL THE PACKAGES
var express       = require('express'), // call express
    app           = express(), // define our app using express
    bodyParser    = require('body-parser'), // get body-parser
    morgan        = require('morgan'), // used to see requests(logger)
    mongoose      = require('mongoose'); // for working w/ our databases MongoDB

var path = require('path');

// require the User models
var User = require('./app/models/user');

// require the configt file
var config = require('./config');


// APP CONFIGURATION
//////////////////////////////////////////////////////////////////////////////////////////////////

// user body parser so we can grab information from POST requests
app.use(bodyParser.urlencoded({extended: true }));
app.use(bodyParser.json());

// configure our app to handle CORS requests
// Here we are setting our configuration to allow requests from other domains to prevent CORS errors. This allows any domain to access our API
app.use(function(req, res, next) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST');
  res.setHeader('Acess-Control-Allow-Headers', 'X-Requested-With, content-type, \
    Authorization');
  next();
});

// log all requests to the console
app.use(morgan('dev'));

// connect to our local database and name it sci4H20
mongoose.connect(config.database);

// set static files location
// used for requests that our frontend will make
app.use(express.static(__dirname + '/public'));


// ROUTES FOR OUR API
///////////////////////////////////////////////////////////////////////////////////////////////////


// API ROUTES
// require api.js in the app/routes/api.js
var apiRouter = require('./app/routes/api')(app, express);
// REGISTER OUR ROUTES
// all of our routes will be prefixed with /api
app.use('/api', apiRouter);

// IMPORTANT to put this route AFTER the API routes since we only want it to catch routes not handled by NODE
// MAIN CATCHALL
// SEND USERS TO
// has to be registered after API ROUTES
app.get('*', function(req, res) {
res.sendFile(path.join(__dirname + '/public/app/views/index.html'));
});


// START THE SERVER
///////////////////////////////////////////////////////////////////////////////////////////////////

app.listen(config.port);
console.log('Starting on port ' + config.port);


// Create a Secrete to Create Tokens with (and verify)
// moved to the config.js
// var secret = 'ilovescotchyscotch';
// or superSecret
// var superSecret = 'ilovescotchscotchyscotchscotch'
