import http from 'http';
import express from 'express';
import expressSession from 'express-session';
import connectredis from 'connect-redis';
import bodyparser from 'body-parser';
import config from './config';
import mongoose from 'mongoose';
import initPassport from './strategies';

const RedisStore 	 = connectredis(expressSession);
let PORT; 

if (process.argv.length > 2){
  PORT = parseInt(process.argv[2]);
}

PORT = PORT || 8080

mongoose.connect(config.mongo.url);

let app = express();

//to support posts!
app.use(bodyparser.urlencoded({extended:false}));
app.use(bodyparser.json());
app.use(expressSession(
                      {
                        store: new RedisStore({
                          host: config.redis.host,
                          port: config.redis.port,
                          disableTTL: true,
                          pass: config.redis.pass || undefined,
                        }),
                        key: 'express.sid',
                        resave: false,
                        rolling: false,
                        saveUninitialized:false, //else passport will save empty object to store, which forces logout!
                        cookie:{
                            maxAge: 2*24*60*60*1000, //2 days
                        },
                        secret: config.secret,
                      }
));


initPassport(app);
app.set('view engine', 'html');
app.engine('html', require('ejs').renderFile);


var server = http.createServer(app);

const ensureAuthenticated = (req, res, next) => {
  if (req.isAuthenticated()){
    return  next(null);
  }
  console.log("not authenticated - so redirecting!");
  res.redirect("/editor/auth/github");
};



app.use('/', express.static("static"));
app.use('/auth', require('./routes/auth'));
app.use('/github', ensureAuthenticated, require('./routes/github'));


app.get('/', ensureAuthenticated, function(req,res){
  	res.render('index');
});


console.log(`listening on port ${PORT}`);
server.listen(PORT);
