import http from 'http';
import express from 'express';
import expressSession from 'express-session';
import connectredis from 'connect-redis';
//import connectmongostore from 'connect-mongostore';
import bodyparser from 'body-parser';
import config from './config';
import mongoose from 'mongoose';
import initPassport from './strategies';
const RedisStore 	 = connectredis(expressSession);

//require('connect-mongostore')(express);
mongoose.connect(config.mongo.url);
//const MongoStore = connectmongostore(expressSession);

let PORT = 8086

if (process.argv.length > 2){
	PORT = parseInt(process.argv[2]);
}

let app = express();

//to support posts!
app.use(bodyparser.urlencoded({extended:false, limit: '5mb'}));
app.use(bodyparser.json({limit: '5mb'}));


app.use(expressSession(
                      {
                        store: new RedisStore({
                            host: config.redis.host,
                            port: config.redis.port,
                            disableTTL: true,
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
  console.log("user is authenticated is ");
  console.log(req.isAuthenticated());

  if (req.isAuthenticated()){
    return  next(null);
  }
  
  res.redirect("/login");
};

app.use('/', express.static("static"));
app.use('/auth', require('./routes/auth'));
app.use('/github', ensureAuthenticated, require('./routes/github'));
app.use('/nodered', ensureAuthenticated, require('./routes/nodered'));
app.use('/samples', ensureAuthenticated, require('./routes/samples'));
app.use('/uibuilder', ensureAuthenticated, require('./routes/uibuilder'));

app.get('/login', function(req,res){
	res.render('login');	
});

app.get('/', ensureAuthenticated, function(req,res){
  res.render('index');
});

console.log(`listening on port ${PORT}`)
server.listen(PORT);
