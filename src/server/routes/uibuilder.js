import express from 'express';
import fs from 'fs';
import path  from 'path';
const  Promise = require('bluebird');
Promise.promisifyAll(fs);

const router = express.Router();

const ROOTDIR = path.join(__dirname, `../static/uibuilder/`);

router.post('/scene/add', function(req, res){
  const DIRECTORY = path.join(ROOTDIR, '/scenes/');
  
  const {name, scene} = req.body;
  
  var ts    = Date.now();
  var filename  = path.join(DIRECTORY, `${ts}_${name}.scene`);
  
  fs.writeFileAsync(filename, scene).then(function(){
    res.send({success:true});
  },function(err){
    res.send({success:false});
  });

});

router.get('/scenes/:name', (req,res)=>{
  res.sendFile(path.join(ROOTDIR, '/scenes/' + req.params.name));
});

router.get('/scenes/', (req,res)=>{
  fs.readdir(path.join(ROOTDIR, '/scenes/'), (err, files) => {
      

      files = files || [];
      
      const scenes = files.filter((fileName)=>{
        return fileName.indexOf(".scene") != -1
      });

      /*const scenes = images.map((fileName)=>{
         

          const f = path.join(__dirname, `./src/client/assets/images/${fileName}`);
         
          var contents = fs.readFileSync(f, 'utf8');
          
          return {
              image: fileName,
              body: contents,
          }
      });*/

      res.send(scenes);
  });
});

//just dev, so blocking read of images dir
router.get('/images/', (req,res)=>{
  fs.readdir(path.join(ROOTDIR, '/images/'), (err, files) => {
      
      if (!files || err){
        res.send([]);
        return;
      }

      const images = files.filter((fileName)=>{
        return fileName.indexOf(".svg") != -1
      });

      const data = images.map((fileName)=>{
         

          const f = path.join(ROOTDIR, `/images/${fileName}`);
         
          var contents = fs.readFileSync(f, 'utf8');
          
          return {
              image: fileName,
              body: contents,
          }
      });

      res.send(data);
  });
});

router.get('/images/:name', (req,res)=>{
   res.sendFile(path.join(ROOTDIR, '/images/' + req.params.name));
});


router.post('/image/add', function(req, res){
  
  const DIRECTORY = path.join(ROOTDIR, '/images/');

  const {name, image} = req.body;
  
  //var data = image.replace(/^data:image\/\w+;base64,/, "");
  //var buf = new Buffer(data, 'base64');
  var filename  = path.join(DIRECTORY, name);
  
  
  fs.writeFileAsync(filename, image).then(function(){
    res.send({success:true});
  },function(err){
    console.log(err);
    res.send({success:false});
  });
});

module.exports = router;