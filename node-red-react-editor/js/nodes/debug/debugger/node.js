import React from 'react';
import composeNode from '../../../utils/composeNode';
import Textfield from '../../../components/form/Textfield';
import Cell from '../../../components/Cell';
import Cells from '../../../components/Cells';
import Select from '../../../components/form/Select';

class Node extends React.Component {

	   componentDidMount(){
	  	 
	   }
	   
       render() {
       
       	  
         const nameprops = {
              id: "name",
              value: 	this.props.values.name || "",
			  
              onChange: (property, event)=>{
                  this.props.updateNode(property, event.target.value);
              },
          }
		
		  const nameinput = <div className="centered">
								<Textfield {...nameprops}/>												
						  	</div>
						  
		
		  const completeprops = {
				options: [
					                {name: "full message", value: "true"},
					                {name: "just payload", value: "false"},
					     ],
					     
				onSelect: (event)=>{
					this.props.updateNode("complete", event.target.value);
				},
				
				style: {width: '100%'},
				value: this.props.values.complete || "false",
		  }
			
		  const completeinput = <div className="centered">
							<Select {...completeprops}/>												
						  </div>
						  
						  			  				  	
          return  <div>
          			<Cells>	
          				<Cell title={"name"} content={nameinput}/>
          				<Cell title={"show"} content={completeinput}/>
          			</Cells>
            	  </div>
          
       }
}

export default composeNode(Node, 'debugger', {

	category: 'outputs',      
	color: '#d45500',
	
	defaults: {
    	name: {value:""},
        active: {value:true},
        console: {value:"false"},
        complete: {value:"false", required:true}
    },
	
	inputs:1,               
	outputs:0,             
	
	schema: (subtype)=>{					
		return	{}
	},
	
	icon: "fa-bug",
	unicode: '\uf188 ',     
	label: function() {     
		return this.name||"debugger";
	},
	labelStyle: function() { 
		return this.name?"node_label_italic":"";
	},
	description: ()=>"<p>The Debug node can be connected to the output of any node. It can be used to display the output of any message property in the debug tab of the sidebar. The default is to display <code>msg.payload</code>.</p> <p>Each message will also display the timestamp, and the type of property chosen to output.</p><p>If the payload is an object or buffer it will be stringified first for display and indicate that by saying '(Object)' or '(Buffer)'.</p>",

});