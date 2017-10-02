import React from 'react';
import Textfield from 'components/form/Textfield';
import Select from 'components/form/Select';
import Cell from 'components/Cell';
import Cells from 'components/Cells';

class Node extends React.Component {

    render() {
       
    
        const {selected,values,updateNode} = this.props;
          
        const nameprops = {
            id: "name",
            value: 	this.props.values.name || "",
			  
            onChange: (property, event)=>{
                this.props.updateNode(property, event.target.value);
            },
        }
          
        const typeprops = {
				  
          options: [
						{name: 'power', value: 'power'},
		        {name: 'voltage', value: 'voltage'},
		        {name: 'current', value: 'current'},
		        {name: 'on/off', value: 'power-state'},
		      ],
					     
				  onSelect: (event)=>{
					 this.props.updateNode("subtype", event.target.value);
					 this.props.updateOutputSchema(event.target.value);
				  },
				
				  style: {width: '100%'},
				  value: this.props.values.subtype || "",
        }
			
        const typeinput = <div className="centered">
							<Select {...typeprops}/>												
						  </div>

        const nameinput =   <div className="centered">
								              <Textfield {...nameprops}/>												
                            </div>
        return  <div>
          			 <Cells>	
          			 	 <Cell title={"name"} content={nameinput}/>
          				  <Cell title={"type"} content={typeinput}/>
          			 </Cells>
            	  </div>	
    }
}