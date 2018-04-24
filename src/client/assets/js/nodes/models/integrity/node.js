import React, {PropTypes, Component} from 'react';
import Textfield from 'components/form/Textfield';
import Select from 'components/form/Select';
import Cell from 'components/Cell';
import Cells from 'components/Cells';
import { formatSchema } from 'utils/utils';
import {configNode} from 'utils/ReactDecorators';


@configNode()
export default class Node extends Component {
    
    componentDidMount(){
            //if (this.props.values.subtype){
            //  this.props.updateOutputSchema(this.props.values.subtype);
        //  }
    }
            
        
  render() {
       
      const {node,values={},updateNode} = this.props;

      const nameprops = {
          id: "name",
          value:    values.name || "",

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
               </div>   
          
    }
}