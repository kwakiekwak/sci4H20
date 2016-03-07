// BASE SETUP
///////////////////////////////////////////////////////////////////////////////////////////////////

// CALL THE PACKAGES
var express       = require('express'), // call express
    app           = express(), // define our app using express
    bodyParser    = require('body-parser'), // get body-parser
    morgan        = require('morgan'), // used to see requests(logger)
    mongoose      = require('mongoose'), // for working w/ our databases MongoDB
    port          = process.env.PORT || 8080; // set the port for our app

// require the User models
var User = require('./models/user');

// connect to our local database and name it sci4H20
mongoose.connect('mongodb://localhost:27017/sci4H20');

// APP CONFIGURATION
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

// ROUTES FOR OUR API
///////////////////////////////////////////////////////////////////////////////////////////////////

// basic route for the home page
// checking to see if everything works
app.get('/', function(req, res) {
  res.send('Welcome to the home page!');
});

// get an instance of the express router
var apiRouter = express.Router(); // get an instance of the express Router

// middeware to user for all requests
apiRouter.use(function(req, res, next) {
  // do loggin
  console.log('Somebody just came to our app!');

  // we'll add more to the middleware in Chapter 10
  // this is where we will authenticate users


  next(); // make sure we go to the next routes and don't stop here
})

// test route to make sure everything is working
// accessed at GET http://localhost:8080/api
apiRouter.get('/', function(req, res) {
  res.json({message: 'Hooray! welcome to our api!'});
});

// more routes for our API will happen here


// REGISTER OUR ROUTES
// all of our routes will be prefixed with /api
app.use('/api', apiRouter);

// START THE SERVER
///////////////////////////////////////////////////////////////////////////////////////////////////

app.listen(port);
console.log('Starting on port ' + port);
