import React, {PropTypes, Component} from 'react';
import {configNode} from 'utils/ReactDecorators';
import Cell from 'components/Cell';
import Cells from 'components/Cells';
import Textfield from 'components/form/Textfield';
import Select from 'components/form/Select';

@configNode()
export default class Node extends Component {

    render(){
        
        const {node,values={},updateNode, updateOutputSchema} = this.props;
        
        const nameprops = {
          id: "name",
          placeholder:"name",
          value: values.name || "",
          onChange: (property, event)=>{
            updateNode(property, event.target.value);
          },
        }
        
        const typeprops = {    

          id: "subtype", 
          placeholder: "select a subtype",

          options: [
              {name: 'on', value: 'bulb-on'},
              {name: 'hue', value: 'bulb-hue'},
              {name: 'brightness', value: 'bulb-bri'},
              {name: 'temperature', value: 'hue-ZLLTemperature'},
              {name: 'presence', value: 'hue-ZLLPresence'},
              {name: 'light-level', value: 'hue-ZLLLightLevel'}
          ],
          
          label:"subtype",
          itemLabel:"name",
          itemValue:"value",

          onSelect: (event)=>{
             updateNode("subtype", event.target.value);
          },  
            
          helpText:"Select a subtype!",
          value: values.subtype || ""
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