import React, {PropTypes, Component} from 'react';
import Textfield from 'components/form/Textfield';
import Select from 'components/form/Select';
import Cell from 'components/Cell';
import Cells from 'components/Cells';
import { formatSchema } from 'utils/utils';
import {configNode} from 'utils/ReactDecorators';
import Editor from './features/editor/components/Editor';

import { actionCreators as templateActions } from 'nodes/processors/uibuilder/features/canvas/';
import { actionCreators as mapperActions } from 'nodes/processors/uibuilder/features/mapper/';

const PALETTE_WIDTH = 60;
const TOOLBARHEIGHT = 64;
const CELLHEIGHT = 40;

@configNode()
export default class Node extends Component {	
	 

  componentDidMount(){
      const {dispatch, node:{id}, values={}} = this.props;
      const {templates={}, mappings={}, transformers={}} = values;
      dispatch(templateActions.init(id, templates));
      dispatch(mapperActions.init(id, mappings, transformers));
  }
  
  render() {
       
      const {node,h,w,values={},updateNode, inputs=[], store, contentw, contenth} = this.props;

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
      const width  = contentw - PALETTE_WIDTH;

      return <div>
          			<Cells>	
          				<Cell title={"name"} content={nameinput}/>
          			</Cells>
                <div style={{height:contenth-CELLHEIGHT}}>
                   <Editor canvasheight={contenth-CELLHEIGHT} canvaswidth={width} originaldimensions={node.canvasdimensions} store={store} nid={node.id} inputs={inputs} updateNode={updateNode}/>
                </div>
        	   </div>	
          
    }
}