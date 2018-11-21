import React, {PropTypes, Component} from 'react';
import Textfield from 'components/form/Textfield';
import Cell from 'components/Cell';
import Cells from 'components/Cells';
import {configNode} from 'utils/ReactDecorators';
import RuleEditor from './features/rules/components/RuleEditor';
import { compose } from 'redux';


@configNode()
export default class Node extends Component {	
	 

  componentDidMount(){
      const {dispatch, node:{id}, values={}} = this.props;     
  }
  
  render() {
       
      const {node:{id},values={},updateNode, inputs=[], store} = this.props;


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
            
     
      return    <div>
          			<Cells>	
          				<Cell title={"name"} content={nameinput}/>
          			</Cells>
                   <RuleEditor id={id}/>
        	    </div>	
          
    }
}