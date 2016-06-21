import express from 'express';
import passport from 'passport';

const router = express.Router();
  
router.get('/github', passport.authenticate('github', { scope: 'repo' }));

router.get('/github/callback', 
  	
  	passport.authenticate('github', { failureRedirect: '/auth/github' }),
  	
  	function(req, res) {
    	res.redirect('/');
});

module.exports = router;

