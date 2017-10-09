import passport  from 'passport';
import passportGithub from 'passport-github';
const GitHubStrategy = passportGithub.Strategy;

export default function initPassport(app, config){
	
	
	const {CLIENT_ID="", CLIENT_SECRET="", CALLBACK=""} = config.github;

	
	if (CLIENT_ID.trim() == "" || CLIENT_SECRET.trim() == "" || CALLBACK.trim() == ""){
		return;
	}
	
	
	var User = require('./models/user')(config.mongo.URL);

	app.use(passport.initialize());
	app.use(passport.session());

	passport.use(new GitHubStrategy({
    				clientID: config.github.CLIENT_ID,
    				clientSecret: config.github.CLIENT_SECRET,
    				callbackURL: config.github.CALLBACK
  				 },
 
				function(accessToken, refreshToken, profile, cb) {
					
					User.findOne({ githubId: profile.id }, function (err, user) {
						if (user == null){
							var newuser = new User({ githubId: profile.id, 
												username: profile.username, 
												 accessToken: accessToken, 
												 email:profile.email,
											   });
							newuser.save(function (err) {
								return cb(err, user);
							});
						}else{
							//MUST update here - incase the token has changed
							var conditions = {  accessToken: accessToken }
							User.update({ githubId: profile.id }, { $set: { accessToken: accessToken }}, function(err, u){
								return cb(null, user);
							});			
						}
					});
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
}
