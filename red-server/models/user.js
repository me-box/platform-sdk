var mongoose = require('mongoose');

module.exports = mongoose.model('User',{
    username: String,
    githubId: String,
    accessToken: String,
    refreshToken: String
});