import express from 'express';
import fs from 'fs';
const router = express.Router();


router.get('/:sensor', function(req, res){

	const sensor 	= req.params.sensor;
	console.log("received request for sensor");
	console.log(sensor);
	
	if (!sensor){
		res.send({success:false, error: "no sensor provided"});
		return;
	}
	
	const valid 	= /^[a-zA-Z]+$/.test(sensor);
	
	if (!valid){
		console.log("invalid sensor requested!");
		res.send({success:false, error: "invalid sensor type"});
		return;
	}
		
	fs.readFile(`./static/samples/${sensor}.json`, 'utf8', function (err, data) {
	  if (err){
	  	 console.log(err);
		 res.send({success:false, error: err});
		 return;
	  }
	  try{
		
		res.send({success:true, data:JSON.parse(data)});
	  	return;
	  }
	  catch(err){
	  	 console.log(err);
	  	 res.send({success:false, error: "failed to read sensor data"});
	  	 return;
	  }
	});
});

module.exports = router;