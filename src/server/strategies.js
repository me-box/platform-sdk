import passport  from 'passport';
import passportGithub from 'passport-github';
import User from './models/user';
import config from './config';
const GitHubStrategy = passportGithub.Strategy;

export default function initPassport(app){

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
							
							return cb(null, user);
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

	app.use(passport.initialize());
	app.use(passport.session());
}
