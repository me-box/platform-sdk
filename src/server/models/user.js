import mongoose from 'mongoose';

module.exports = function(url){
	
	mongoose.connect(`${url}/passport`);

	return mongoose.model('User',{
	    username: String,
	    githubId: String,
	   	email: String,
	    accessToken: String,
	});
}