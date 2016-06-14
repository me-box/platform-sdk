var passport = require('passport');
var GitHubStrategy = require('passport-github').Strategy;
var config = require('../config');
var User = require('../models/user');

passport.use(new GitHubStrategy({
    clientID: config.GITHUB_CLIENT_ID,
    clientSecret: config.GITHUB_CLIENT_SECRET,
    callbackURL: "http://178.62.110.78/editor/auth/github/callback"
  },
  function(accessToken, refreshToken, profile, cb) {	
    User.findOne({ githubId: profile.id }, function (err, user) {
  		if (user == null){
  			var newuser = new User({ githubId: profile.id, 
  									 username: profile.username, 
  									 accessToken: accessToken, 
  									 refreshToken: refreshToken 
  								   });
  			newuser.save(function (err) {
  			   return cb(err, user);
  			});
  		}else{
  			return cb(null, user);
  		}
	});
    //User.findOrCreate({ githubId: profile.id }, function (err, user) {
    //  return cb(err, user);
    //});
  }
));


passport.serializeUser(function(user, done) {
  done(null, user._id);
});
 
passport.deserializeUser(function(id, done) {
  User.findById(id, function(err, user) {
    done(err, user);
  });
});


module.exports = function(app){

  app.use(passport.initialize());
  app.use(passport.session());
  
  app.get('/auth/github', passport.authenticate('github', { scope: 'repo' }));

  app.get('/auth/github/callback', 
  	
  	passport.authenticate('github', { failureRedirect: '/editor/auth/github' }),
  	
  	function(req, res) {
    	// Successful authentication, redirect home.
    	console.log("great -- suucess!");
    	res.redirect('/editor');
  });

}