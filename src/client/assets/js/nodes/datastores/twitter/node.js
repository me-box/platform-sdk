import React from 'react';
import composeNode from 'utils/composeNode';
import Textfield from 'components/form/Textfield';
import Cell from 'components/Cell';
import Cells from 'components/Cells';
import Select from 'components/form/Select';
import {configNode} from 'utils/ReactDecorators';

@configNode()
export default class Node extends React.Component {
   
  render() {
       
       	  
    const nameprops = {
      id: "name",
      value: 	this.props.values.name || "",
			  
      onChange: (property, event)=>{
          this.props.updateNode(property, event.target.value);
      },
    }
		
		const nameinput = <div className="centered"><Textfield {...nameprops}/> </div>
						  	
    const typeprops = {
				options: [
					{name: 'twitter timeline', value: 'twitterUserTimeLine'},
					{name: 'twitter stream', value: 'twitterHashTagStream'},
				],
					     
				onSelect: (event)=>{
					this.props.updateNode("subtype", event.target.value);
				},
				
				style: {width: '100%'},
				value: this.props.values.subtype || "",
		}
			
		const typeinput = <div className="centered">
							           <Select {...typeprops}/>												
						          </div>
						  
    return  <div>
          		<Cells>	
          			<Cell title={"name"} content={nameinput}/>
          			<Cell title={"type"} content={typeinput}/>
          		</Cells>
            </div>
          
    }
}