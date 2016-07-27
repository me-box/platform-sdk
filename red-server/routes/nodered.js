import express from 'express';
import request from 'superagent';
import config from '../config.js';
import docker from '../utils/docker.js';

const router = express.Router();

router.post('/flows', function(req, res){
	
	console.log(req.user);
	
	docker.createContainer({Image: 'docker_red', Cmd: ['node', '/root/node-red/red.js'], name: `${req.user.username}-red`}, function (err, container) {
  		if (err){
  			console.log(err);
  		}else{
  			container.start({"PortBindings": { "1880/tcp": [{ "HostPort": "11022" }]}}, function (err, data) {
  				if (err){
  					console.log("error!");
  					console.log(err);
  				}else{
  					console.log(data);
  				}
  			});
  		}
	});
	
	var data = req.body;
	
	request
   			.post(`${config.red.URL}/flows`)
   			.send(data)
   			.set('Accept', 'application/json')
   			.type('json')
   			.end((err, data)=>{
     			
     			if (err) {
       				console.log(err);
       				res.status(500).send({error:'could not contact node red'});
     			} else {
     				console.log("successfully installed new flows");
       				res.send({success:true});
     			}
   			});
	
});

module.exports = router;