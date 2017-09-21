import React, { Component, PropTypes } from 'react';
import { Flex,Box } from 'reflexbox';


const indent = (path)=>{
	return path.reduce((acc, obj)=>{
		return `»» ${acc}`;
	},"")
}

export default class Schema extends Component {

	     static propTypes = {
    		schema: PropTypes.object.isRequired,
    		onSelect: PropTypes.func.isRequired
  	  };

      constructor(props){
          super(props);
          this.renderNode = this.renderNode.bind(this);
      }
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
         const {selected} = this.props;
         
         const style = {
            
         };

          if (selected && selected.key === key){
              if (selected.path.length === path.length){
                 const amselected = selected.path.reduce((acc, item , i)=>{
                    return acc && item === path[i]; 
                 },true)
                 style.fontWeight = "bold";
                 style.textTransform = "uppercase";
              }
          }
          return <Box className="sourceattr" style={style} key={`${path.join()}${key}`} onClick={this.props.onSelect.bind(null,key,path,type)}>{indent(path)}{key}</Box>
  	  }

  	  render(){
          const {schema} = this.props;
          
  	  		const key = "";
  	  		if (schema.type === "object"){
  	  				return <Flex flexColumn={true}>
  	  					{/*this.renderNode(key,[], schema)*/}
  	  					{this.renderTree([], schema.properties)}
  	  				</Flex>
  	  		}
  	  		else{
  	  			return this.renderNode(key, [], schema.type);
  	  		}
  	 
  	  }
}