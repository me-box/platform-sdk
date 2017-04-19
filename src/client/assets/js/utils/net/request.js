import request from 'superagent';

export function get(url, query){	
  return new Promise((resolve, reject)=>{
     request
      .get(url)
      .query(query || {})
      //.set('Accept', 'image/svg+xml')
      .set('Accept', 'application/json')
      .end(function(err, res){
        if (err){
          reject(err);
        }else{
          resolve(res);
        }
     });
  })
}


export function post(url, data){  
  return new Promise((resolve, reject)=>{
     request
      .post(url)
      .send(data)
      .set('Accept', 'application/json')
      .type("json")
      .end(function(err, res){
        if (err){
          reject(err);
        }else{
          resolve(res);
        }
     });
  })
}
