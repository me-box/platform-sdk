import React, {PropTypes, Component} from 'react';
import Textfield from 'components/form/Textfield';
import Select from 'components/form/Select';
import Cell from 'components/Cell';
import Cells from 'components/Cells';
import { formatSchema } from 'utils/utils';
import {configNode} from 'utils/ReactDecorators';
import Editor from './features/editor/components/Editor';

const PALETTE_WIDTH = 60;

@configNode()
export default class Node extends Component {	
	   	
  render() {
       
      console.log("IN NODE WITH PROPS");
      console.log(this.props);

      const {node,h,w,values={},updateNode, store, contentw, contenth} = this.props;

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


      const height = contenth -  40 /*Cell height*/;  

      return <div>
          			<Cells>	
          				<Cell title={"name"} content={nameinput}/>
          			</Cells>
                <div style={{height:height, background:'green', width:"100%"}}>
                   <Editor canvasheight={height} canvaswidth={contentw-PALETTE_WIDTH} store={store} nid={node.id}/>
                </div>
        	   </div>	
          
    }
}