import mongoose from 'mongoose';
import config from '../config';

console.log("config is", JSON.stringify(config,null,4));
console.log("user connection url is", `${config.mongo.url}/passport`);

mongoose.connect(`${config.mongo.url}/passport`);

module.exports = mongoose.model('User',{
    username: String,
    githubId: String,
   	email: String,
    accessToken: String,
});