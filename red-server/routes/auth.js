import express from 'express';
import passport from 'passport';
import User from '../models/user';
const router = express.Router();

//need to explicity log this user out 
router.get('/logout',  function(req,res){
	console.log("IN LOGOUT - USER IS ");
	console.log(req.user);
	
	if (req.user){
		console.log("removing user");
		console.log(req.user);
		User.findOne({ username: req.user.username}).remove().exec();
	}
	
	req.logout();
	
	req.session.destroy(function(err){
		res.redirect("/");
	});
});
  
router.get('/github', passport.authenticate('github', { scope: 'repo' }));

router.get('/github/callback', 
  	
  	passport.authenticate('github', { failureRedirect: '/auth/github' }),
  	
  	function(req, res) {
    	res.redirect('/');
});

module.exports = router;

