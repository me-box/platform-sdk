import React, {PropTypes, Component} from 'react';
import Textfield from 'components/form/Textfield';
import Select from 'components/form/Select';
import Cell from 'components/Cell';
import Cells from 'components/Cells';
import { formatSchema } from 'utils/utils';
import {configNode} from 'utils/ReactDecorators';
import Editor from './features/editor/components/Editor';

@configNode()
export default class Node extends Component {	
	   	
  render() {
       
      const {node,values={},updateNode, store} = this.props;

      const nameprops = {
          id: "name",
          value: 	values.name || "",

          onChange: (property, event)=>{
              updateNode("name", event.target.value);
          },
      }

     
      const nameinput = <div className="centered">
      			<Textfield {...nameprops}/>												
      	  	</div>

      	  
      return <div>
          			<Cells>	
          				<Cell title={"name"} content={nameinput}/>
          			</Cells>
                <div style={{height: 'calc(100vh - 200px)', background:'green', width:"100%"}}>
                   <Editor store={store} node={node}/>
                </div>
        	   </div>	
          
    }
}