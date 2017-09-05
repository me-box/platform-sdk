import http from 'http';
import express from 'express';
import expressSession from 'express-session';
import connectredis from 'connect-redis';
import bodyparser from 'body-parser';
import {fetch} from './config';
import initPassport from './strategies';
import minimist from 'minimist';

const RedisStore 	 = connectredis(expressSession);
const argv = minimist(process.argv.slice(2));


const PORT = argv.port || 8086;
const dev = argv.dev || false;
console.log("set port to", PORT);

fetch({dev:true}).then((config)=>{
  console.log("ok here!")
  start(config);
}, (err)=>{
  console.log("ok am here!!");
  console.log("error reading config!", err);
});

function checkcredentials(config){
  console.log("checking credentials for ", JSON.stringify(config,null,4));
  const {CLIENT_ID, CLIENT_SECRET, CALLBACK} = config.github;
  return (CLIENT_ID.trim()!="" && CLIENT_SECRET.trim()!="" && CALLBACK.trim()!="");
}

function addroutes(app, auth){
  console.log("adding routes!");
  app.use('/auth', require('./routes/auth'));
  app.use('/github', auth, require('./routes/github'));
  app.use('/nodered', auth, require('./routes/nodered'));
  app.use('/samples', auth, require('./routes/samples'));
  app.use('/uibuilder', auth, require('./routes/uibuilder'));
}

function start(config){

  console.log("starting with config", JSON.stringify(config, null, 4));

  const app = express();

  //to support posts!
  app.use(bodyparser.urlencoded({extended:false, limit: '5mb'}));
  app.use(bodyparser.json({limit: '5mb'}));

  app.use(expressSession(
    {
      store: new RedisStore({
          host: config.redis.host,
          port: config.redis.port,
      }),
      key: 'express.sid',
      resave: false,
      rolling: false,
      saveUninitialized:false, 
      cookie:{
          maxAge: 2*24*60*60*1000, //2 days
      },
      secret: config.secret,
    }
  ));

  app.set('view engine', 'html');
  app.engine('html', require('ejs').renderFile);

  var server = http.createServer(app);
  
  const auth = (req, res, next) => {
    
    console.log("checking is req is authenticated");
    console.log(req.user, req.isAuthenticated());

    if (req.isAuthenticated()){
      req.config = config;
      return  next(null);
    }

    res.redirect("/login");
  };

  
  if(checkcredentials(config)){
    initPassport(app, config);
    addroutes(app,auth);
  }

  app.get('/login', function(req,res){
    res.render('login');  
  });

  app.use('/', express.static("static"));

  app.get('/', function(req,res){
    
    console.log("in root route!");

    if (!checkcredentials(config)){
      console.log("credentials are empty, so redirecting to settings")
      res.redirect('/settings');
      return;
    }

    console.log("ok creds are fine!!");
    
    if (!req.isAuthenticated()){
      res.redirect("/login");
      return;
    }

    res.render('index');  

  });

  app.get('/settings', function(req,res){
      if (checkcredentials(config)){
         res.render('settings', {title:"great, you have updated your config settings", config:"[secret]"});
      }else{
        res.render('settings', {title:"Nearly there - you just need set your github settings", config:JSON.stringify(config.github || {},null,4)});
      }
  });

  app.get('/settings/testurl', function(req,res){
    res.send({testurl:config.testserver.URL})
  });

  console.log(`listening on port ${PORT}`)
  server.listen(PORT);

}



