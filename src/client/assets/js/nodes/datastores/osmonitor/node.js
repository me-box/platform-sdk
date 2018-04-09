import React, {Component} from 'react';
import Textfield from 'components/form/Textfield';
import Select from 'components/form/Select';
import Cell from 'components/Cell';
import Cells from 'components/Cells';
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
          
    const typeprops = {
			options: [
                {name: '1 min load average', value: 'loadavg1'},
                {name: '5 min load average', value: 'loadavg5'},
                {name: '15 min load average', value: 'loadavg15'},
                {name: 'free memory', value:'freemem'},
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

		const nameinput = <div className="centered">
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