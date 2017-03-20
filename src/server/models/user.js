import mongoose from 'mongoose';

module.exports = mongoose.model('User',{
    username: String,
    githubId: String,
   	email: String,
    accessToken: String,
});