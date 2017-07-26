import passport  from 'passport';
import passportGithub from 'passport-github';
import User from './models/user';
import config from './config';
const GitHubStrategy = passportGithub.Strategy;

export default function initPassport(app){

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
							console.log("saving new user");

							var newuser = new User({ githubId: profile.id, 
												username: profile.username, 
												 accessToken: accessToken, 
												 email:profile.email,
											   });
							newuser.save(function (err) {
								console.log("successfully saved user", user);
								return cb(err, user);
							});
						}else{
							console.log("found user, so returning", JSON.stringify(user,null,4))
							return cb(null, user);
						}
					});
				}
 	));

	passport.serializeUser(function(user, done) {
		console.log("serialising user", JSON.stringify(user,null,4));
  		done(null, user._id);
	});
 
	passport.deserializeUser(function(id, done) {
	  console.log("searching for user", id);

	  User.findById(id, function(err, user) {
	  	console.log("found user", JSON.stringify(user,null,4));	
		done(err, user);
	  });
	});
}
