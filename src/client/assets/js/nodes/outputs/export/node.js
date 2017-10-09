import React from 'react';
//import composeNode from 'utils/composeNode';
import Textfield from 'components/form/Textfield';
import Select from 'components/form/Select';
import Cell from 'components/Cell';
import Cells from 'components/Cells';
import { formatSchema } from 'utils/utils';
import {configNode} from 'utils/ReactDecorators';


@configNode()
export default class Node extends React.Component {
	 	
    render() {
       
    
        const {node,values={},updateNode} = this.props;
          
        const nameprops = {
              id: "name",
              value: 	values.name || "",
			  
              onChange: (property, event)=>{
                  updateNode("name", event.target.value);
              },
        }
          
        const urlsprops = {
              id: "urls",
              value: 	values.urls || "",
			  
              onChange: (property, event)=>{
                  updateNode("urls", event.target.value.trim());
              },
        }

		const nameinput = <div className="centered"><Textfield {...nameprops}/></div>
		const urlsinput = <div className="centered"><Textfield {...urlsprops}/></div>
		

        return  <div>
          			<Cells>	
          				<Cell title={"name"} content={nameinput}/>
          				<Cell title={"urls"} content={urlsinput}/>
          				
          			</Cells>
            	  </div>	
          
    }
}