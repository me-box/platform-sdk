import http from 'http';
import express from 'express';
import expressSession from 'express-session';
import connectredis from 'connect-redis';
import bodyparser from 'body-parser';
import {fetch} from './config';
import initPassport from './strategies';
const RedisStore 	 = connectredis(expressSession);

fetch().then((config)=>{
  start(config);
}, (err)=>{
  console.log("error reading config!", err);
});

function checkcredentials(config){
  const {CLIENT_ID, CLIENT_SECRET, CALLBACK} = config.github;
  return (CLIENT_ID.trim()!="" && CLIENT_SECRET.trim()!="" && CALLBACK.trim()!="");
}

function addroutes(app, auth){
 
  app.use('/auth', require('./routes/auth'));
  app.use('/github', auth, require('./routes/github'));
  app.use('/nodered', auth, require('./routes/nodered'));
  app.use('/samples', auth, require('./routes/samples'));
  app.use('/uibuilder', auth, require('./routes/uibuilder'));
}

function start(config){

  console.log("starting with config", JSON.stringify(config, null, 4));

  let PORT = 8086

  if (process.argv.length > 2){
    PORT = parseInt(process.argv[2]);
  }

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
    
    if (req.isAuthenticated()){
      console.log("nice -- authenticated!!");
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

    if (!checkcredentials(config)){
      return fetch().then((c)=>{ //re-check to see if config has changed
        config = c;
        if (!checkcredentials(c)){
          console.log("redirecting to settings...");
           res.redirect("/settings");
           return;
        }else{
          console.log("ok settings is ok, so initing passport!");
          initPassport(app, c);
          addroutes(app,auth);
        }
      })
    }
    res.render('login');  
  });

  app.use('/', express.static("static"));

  app.get('/', function(req,res){
    
    if (!checkcredentials(config)){
      res.redirect('/settings');
      return;
    }
    
    if (!req.isAuthenticated()){
      res.redirect('/login');
    }

    console.log("should be logged in here!");
    res.render('index');  

  });

  app.get('/settings', function(req,res){
    res.render('settings', {config:JSON.stringify(config.github || {},null,4)});
  });

  app.get('/settings/testurl', function(req,res){
    console.log("seen a request for testurl!");
    res.send({testurl:config.testserver.URL})
  });

  console.log(`listening on port ${PORT}`)
  server.listen(PORT);

}



