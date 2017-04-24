import React, {Component} from 'react';
import composeNode from 'utils/composeNode';
import Textfield from 'components/form/Textfield';
import Select from 'components/form/Select';
import Cell from 'components/Cell';
import Cells from 'components/Cells';
import {matchLibraries} from 'utils/utils';
import brace from 'brace';
import AceEditor from 'react-ace';
import 'brace/mode/java';
import 'brace/theme/github';
import {configNode} from 'utils/ReactDecorators';

@configNode()
export default class Node extends Component {

	   constructor(props){
	   		super(props);
	   }
	   
       render() {
          
        	const {node, inputs, values={}, outputs, updateNode} = this.props;
            

         
            
       		
			 const nameprops = {
              id: "name",
              value: values.name || "",
              onChange: (property, event)=>{
                  updateNode(property, event.target.value);
              },
          	}
							
			const nameinput = <div className="centered">
									<Textfield {...nameprops}/>												
								  </div>
	
	
			const syntaxprops = {
				options: [
					    {name: "mustache", value: "mustache"},
					    {name: "plain", value: "plain"},
				],
					     
				onSelect: (event)=>{
					updateNode("syntax", event.target.value);
				},
				
				style: {width: '100%'},
				value: values.syntax || "mustache",
		  	}
			
		  	const syntaxinput = <div className="centered">
							<Select {...syntaxprops}/>												
						  </div>
						  
						  
        	
        	var aceprops = {
        		onChange: (value)=>{
        			 updateNode("template", value);
        		},
        		value: values.template || this.props.node.template || "",
        		mode: "html",
        		theme: "github",
        		name: node.id,
        		editorProps:{$blockScrolling: true},
        		height: '300px',
        		width: '100%',
        		showPrintMargin: false,
        	}
        	
        	const templateinput = <AceEditor {...aceprops}/> 
				
          	return <div>
          			<Cells>		
						<Cell title={"name"} content={nameinput}/>
						<Cell title={"syntax"} content={syntaxinput}/>
						<Cell title={"html"} content={templateinput}/>
          			</Cells>
          		   </div>
          
       }   
}