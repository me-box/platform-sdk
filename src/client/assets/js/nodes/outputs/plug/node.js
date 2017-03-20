import React from 'react';
import composeNode from 'utils/composeNode';
import Textfield from 'components/form/Textfield';
import Select from 'components/form/Select';
import Cell from 'components/Cell';
import Cells from 'components/Cells';
import { formatSchema } from 'utils/utils';
import {configNode} from 'utils/ReactDecorators';


@configNode()
export default class Node extends React.Component {
	
	componentDidMount(){
	  	 	if (this.props.values.subtype){
	   			//this.props.updateOutputSchema(this.props.values.subtype);
	   		}
	}
	   	   	
	   	
    render() {
       
    
         const {node,values={},updateNode} = this.props;
          
         const nameprops = {
              id: "name",
              value: 	values.name || "",
			  
              onChange: (property, event)=>{
                  updateNode("name", event.target.value);
              },
          }
          
          const valueprops = {
				       options: [
									{name: 'on', value: 'on'},
					        {name: 'off', value: 'off'},
					     ],
					     
				onSelect: (event)=>{
					   updateNode("value", event.target.value);
				},
				
				style: {width: '100%'},
				value: values.value || "on",
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