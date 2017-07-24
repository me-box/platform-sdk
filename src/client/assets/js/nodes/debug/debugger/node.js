import React, {Component} from 'react';
import Textfield from 'components/form/Textfield';
import Cell from 'components/Cell';
import Cells from 'components/Cells';
import Select from 'components/form/Select';
import {configNode} from 'utils/ReactDecorators';

@configNode()
export default class Node extends Component {
  
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