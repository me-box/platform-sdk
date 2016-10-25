import React from 'react';
import composeNode from '../../../utils/composeNode';
import Textfield from '../../../components/form/Textfield';
import Select from '../../../components/form/Select';
import Cell from '../../../components/Cell';
import Cells from '../../../components/Cells';
import { formatSchema } from '../../../utils/utils';

class Node extends React.Component {
	
	componentDidMount(){
	  	 	if (this.props.values.subtype){
	   			this.props.updateOutputSchema(this.props.values.subtype);
	   		}
	}
	   	   	
	   	
    render() {
       
    
         const {selected,values,updateNode} = this.props;
          
         const nameprops = {
              id: "name",
              value: 	this.props.values.name || "",
			  
              onChange: (property, event)=>{
                  this.props.updateNode(property, event.target.value);
              },
          }
          
          const valueprops = {
				options: [
									{name: 'on', value: 'on'},
					                {name: 'off', value: 'off'},
					     ],
					     
				onSelect: (event)=>{
					this.props.updateNode("value", event.target.value);
				},
				
				style: {width: '100%'},
				value: this.props.values.value || "on",
		  }
			
			
        
          			  
		  const nameinput = <div className="centered">
								<Textfield {...nameprops}/>												
						  	</div>
		
		  const valueinput = <div className="centered">
							<Select {...valueprops}/>												
						  </div>
		  
						  
          return  <div>
          			<Cells>	
          				<Cell title={"name"} content={nameinput}/>
          				<Cell title={"value"} content={valueinput}/>
          			</Cells>
            	  </div>	
          
    }
}

export default composeNode(Node, 'plugout', 
                            {
                                category: 'outputs',    
                                color: '#d45500',
                                defaults: {             
                                    name: {value:""},   
                                    subtype: {value:"set-plug-power"},
                                    value: {value:"on"},
                                },
                                inputs:1,               
                                outputs:0,             
                               
                                icon: "fa-plug",
                                unicode: '\uf1e6',       
                                label: function() {     
                                    return this.name||"plugout";
                                },
                                
                                schema: (subtype)=>{
                                	return {
										input:{
                                			payload: {type:'string', description: `<i> on </i> or <i> off </i>`},
                                		}
									}
                                },
                                
                                labelStyle: function() { 
                                    return this.name?"node_label_italic":"";
                                },
                                 description: ()=>"<p> turn a plug on or off </p>",
                            }
                          );