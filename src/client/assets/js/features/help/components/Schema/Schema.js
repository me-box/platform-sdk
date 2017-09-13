import React, { Component } from 'react';


const _oneof = function(schema, id, selectedid){
	
	return schema.map((item, i)=>{
	
		let tail = null;
	
		if (item.type === "object"){
			if (item.properties){
				tail = _payload(item.properties, id, selectedid)
			}
		}
		else if (item.type === "oneof"){

			if (item.oneOf){
				tail = _oneof(item.oneOf, id, selectedid)
			}
		}
		else{
			//perhaps have a different format primitive for oneof items?
			tail = _formatprimitive(item,`${item.key}=${item.value}`,id, selectedid);
		}
									
		return 	<div key={i}>
					<div className="flexcolumn">
						<div>
							<div className="flexcolumn">
								{tail}
							</div>
						</div>
					</div>
				</div>
	});
};

const _formatprimitive = function(item,key,id,selectedid){
	return <div key={key}>
				<div className="flexrow">
					<div className="attributetitle">
						<div className="centered">
							<strong>{key}</strong>
						</div>
					</div>
					<div className="fixed" style={{borderRight: '1px solid #b6b6b6', width:100}}>
						<div className="centered">
							{item.type} 
						</div>
					</div>
					<div style={{borderRight: '1px solid #b6b6b6'}}>
						<div className="schemadescription">
							<div dangerouslySetInnerHTML={{__html: item.description.replace("[id]", id).replace("[selectedid]", selectedid)}}></div>
						</div>
					</div>
				</div>
			</div>
}

const _formatobject = function(item,key,id,selectedid){
	return 	<div key={key}>
				<div className="flexrow">
				
					<div className="attributetitle">
						<div className="centered">
							<strong>{key}</strong>
						</div>
					</div>
			
					<div className="fixed" style={{borderRight: '1px solid #b6b6b6', width:100}}>
						<div className="centered">
							{item.type} 
						</div>
					</div>
					<div>
						<div className="flexcolumn">
							{item.properties ? _payload(item.properties, id, selectedid) : null}
							{item.oneOf ? _oneof(item.oneOf, id, selectedid): null}
						</div>
					</div>
				</div>
		   	</div>
				
}



const _payload = function(schema, id, selectedid){
	
	if (!schema)
		return null;

	return Object.keys(schema).map((key,i)=>{
		const item = schema[key];
		if (item.type === "object" || item.type=="oneof"){
			return _formatobject(item,key,id, selectedid); 
		}			
		return _formatprimitive(item,key,id, selectedid);
	});
};

export default class Schema extends Component {

	render(){

		const {schema=null, id, selectedid} = this.props;

		if (!schema || (Object.keys(schema).length === 0 && schema.constructor === Object)) 
			return null;

		const payload = schema.type === "object" ? _payload(schema.properties, id, selectedid) : _formatprimitive(schema,"",id, selectedid);

		
		return 	<div key={this.props.id} className="flexcolumn schema">
					<div className="noborder">
						<div className="flexrow">
							<div>
								<div className="flexcolumn">
									<div>
										<div className="flexrow">
											<div className="headertitle">
												<div className="centered">
													attribute name
												</div>
											</div>
											<div className="header fixed" style={{width:100}}>
												<div className="centered">
												attribute type
												</div>
											</div>
											<div className="header">
												<div className="centered">
													description
												</div>
											</div>
										</div>
									</div>
									{payload}
								</div>
							</div>
					   </div>
					</div>
				</div>

	}  
}