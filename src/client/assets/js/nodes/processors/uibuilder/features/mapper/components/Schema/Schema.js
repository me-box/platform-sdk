import React, { Component, PropTypes } from 'react';
import { Flex,Box } from 'reflexbox';


const indent = (path)=>{
	return path.reduce((acc, obj)=>{
		return "----"+acc;
	},"")
}

export default class Schema extends Component {

	  static propTypes = {
    		schema: PropTypes.object.isRequired,
    		onSelect: PropTypes.func.isRequired
  	  };

  	  //this.renderNode(key, path, schema) && this.renderTree([...path, key], schema.properties);
  	  renderTree(path, schema){
  	  		return Object.keys(schema).map((key,i)=>{
  	  			const _schema= schema[key];
  	  			if (_schema.type === "object"){
  	  				return	<Flex key={i} flexColumn={true}>
  	  					{this.renderNode(key,path, _schema)}
  	  					{this.renderTree([...path,key], _schema.properties)}
  	  				</Flex> 
  	  			}
  	  			else{
  	  				return this.renderNode(key, path, _schema.type);
  	  			}
  	  		});
  	  }

  	  renderNode(key, path, type){
		      return <Box key={`${Math.random()}`} onClick={this.props.onSelect.bind(null,key,path,type)}>{indent(path)}{key}</Box>
  	  }

  	  render(){
          const {schema} = this.props;
      
  	  	  //const items = Object.keys(this.props.schema).map((key,i)=>{
  	  	  //	const schema = this.props.schema[key];
  	  		const key = "";
  	  		if (schema.type === "object"){
  	  				return <Flex flexColumn={true}>
  	  					{this.renderNode(key,[], schema)}
  	  					{this.renderTree([], schema.properties)}
  	  				</Flex>
  	  		}
  	  		else{
  	  			return this.renderNode(key, [], schema.type);
  	  		}
  	  
      	//});

  	  	//return <Flex flexColumn={true}>{items}</Flex>
  	  }
}