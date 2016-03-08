var User    = require('../models/user');
// authentications
var jwt     = require('jsonwebtoken');
var config  = require('../../config');

// super secret for creating tokens
var superSecret = config.secret;

module.exports = function(app, express) {
  var apiRouter = express.Router();

  // route to authenticate a user (POST http://localhost:8080/api/authenticate)
  // route for authenticating users
  apiRouter.post('/authenticate', function(req, res) {
    // find the user
    // select the name email and password explicitly
    User.findOne({
      email: req.body.email
    }).select('name email password').exec(function(err, user) {
      if (err) throw err;

      // no user with that email was found
      if (!user) {
        res.json({
          succes: false,
          message: 'Authentication failed. User not found'
        });
        // if there is a user with the email BUT wrong password
      } else if (user) {

        // check if password matches
        var validPassword = user.comparePassword(req.body.password);
        if(!validPassword) {
          res.json({
            success: false,
            message: 'Authentication failed. Wrong password'
          });
        } else {
          // if user is found and password is right
          // CREATE A TOKEN YAY
          var token = jwt.sign({
            name: user.name,
            email: user.email
          }, superSecret, {
            expiresInMinutes: 1440 // expires in 24 hours
          });

          // return the information including token as JSON
          res.json({
            success: true,
            message: 'Enjoy your token!',
            token: token
          });
        }
      }
    });
  });


  // middeware to user for all requests
  // use to check the token on every request for our authenticated routes
  apiRouter.use(function(req, res, next) {
    // do loggin
    console.log('Somebody just came to our app!');

    // we'll add more to the middleware in Chapter 10
    // this is where we will authenticate users

    // check header or url parameters or post parameters for token
    var token = req.body.token || req.query.token || req.headers['x-access-token'];

    // decode token
    if (token) {
      // verifies secret and checks exp
      jwt.verify(token, superSecret, function(err, decoded) {
        if (err) {

          return res.status(403).send({
            success: false,
            message: 'Failed to authenticate token.'
          });
        } else {

          // if everything is good, save to request for use in other routes
          req.decoded = decoded;

          next();
        }
      });
    } else {

      // if there is no token
      // return an HTTP response of 403 (access forbidden) and an error message
      return res.status(403).send({
        success: false,
        message: 'No token provided.'
      });
    }

    // next(); // make sure we go to the next routes and don't stop here
  });


  // test route to make sure everything is working
  // accessed at GET http://localhost:8080/api
  apiRouter.get('/', function(req, res) {
    res.json({message: 'Hooray! welcome to our api!'});
  });

  // more routes for our API will happen here

  // route middleware and first route here
  apiRouter.route('/users')
    // create a user (accessed at POST http://localhost:8080/api/users)
    .post(function(req, res) {
      // create a new instance of the User model
      var user = new User();

      // set the users information (comes from the request)
      user.name = req.body.name;
      user.email = req.body.email;
      user.password = req.body.password;

      // save the user and check for errors
      user.save(function(err) {
        if (err) {
          // duplicate entry
          if(err.code == 11000)
            return res.json({ success: false, message: 'A user with that \
              email already exists.'});
          else
            return res.send(err);
        }
            res.json({ message: 'User created!' });
      });
    })

    // get all the users (accessed at GET http://localhost:8080/api/users)
    .get(function(req, res) {
      User.find(function(err, users) {
        if (err) res.send(err);

        // return the users
        res.json(users);
      });
    });

  // on routes that end in /users/:user_id
  apiRouter.route('/users/:user_id')

    // get the user with that id
    // (accessed at GET http://localhost:8080/api/users/:user_id)
    .get(function(req, res) {
      User.findById(req.params.user_id, function(err, user) {
        if (err) res.send(err);

        // return that user
        res.json(user);
      });
    })

    // update the user with this id
    .put(function(req, res) {
      // use our model to find the user we want
      User.findById(req.params.user_id, function(err, user) {
        if (err) res.send(err);

        // update the users info only if its new
        if (req.body.name) user.name = req.body.name;
        if (req.body.email) user.email = req.body.email;
        if (req.body.password) user.password = req.body.password;

        // save the user
        user.save(function(err) {
          if(err) res.send(err);

          // return a message
          res.json({message: 'User updated!'});
        });
      });
    })

    // delete the user with this id
    .delete(function(req, res) {
      User.remove({
        _id: req.params.user_id
      }, function(err, user) {
        if (err) return res.send(err);

        res.json({ message: 'Successfully deleted' });
      });
    });

  // api endpoint to get user information about the logged in user
  apiRouter.get('/me', function(req, res) {
    // stored logged in user in req.decoded is now sent
    res.send(req.decoded);
  });
  return apiRouter;
};