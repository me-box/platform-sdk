import React from 'react';
import composeNode from '../../../utils/composeNode';
import Textfield from '../../../components/form/Textfield';
import Textarea from '../../../components/form/Textarea';
import Select from '../../../components/form/Select';
import Cell from '../../../components/Cell';
import Cells from '../../../components/Cells';
import {matchLibraries} from '../../../utils/utils';
import brace from 'brace';
import AceEditor from 'react-ace';
import 'brace/mode/java';
import 'brace/theme/github';



class Node extends React.Component {

	   constructor(props){
	   		super(props);
	   }
	   
       render() {
          
        	const {selected, inputs, outputs, help} = this.props;
            
       		
			const nameprops = {	
									value: 	this.props.values.name || this.props.selected.name || "",
									id: "name",
									onChange:(property, event)=>{
										 this.props.updateNode(property, event.target.value);
									}
								}
							
			const nameinput = <div className="centered">
									<Textfield {...nameprops}/>												
								  </div>
	
	
        	
        	var aceprops = {
        		onChange: (value)=>{
        			 this.props.updateNode("template", value);
        		},
        		value: this.props.values.template || this.props.selected.template || "",
        		mode: "html",
        		theme: "github",
        		name: selected.id,
        		editorProps:{$blockScrolling: true},
        		height: '300px',
        		width: '100%',
        		showPrintMargin: false,
        	}
        	
        	const templateinput = <AceEditor {...aceprops}/> 
				
          	return <div>
          			<Cells>		
						<Cell title={"name"} content={nameinput}/>
						<Cell title={"html"} content={templateinput}/>
          			</Cells>
          		   </div>
          
       }   
}

export default composeNode(Node, 'webify', 
                            {
                                category: 'processors',    
                                color: '#002255',
                                
                                defaults: {             
                                    name: {value:""},
									name: {value:""},
									field: {value:"payload"},
									fieldType: {value:"msg"},
									format: {value:"handlebars"},
									syntax: {value:"mustache"},
									template: {value:"This is the payload: {{payload}} !"},
                                },
                                
                                inputs:1,               
                                outputs:1,             
                               
                                icon: "fa-file-code-o",    
                                unicode: '\uf1c9',    
                                label: function() {     
                                    return this.name||"webify";
                                },
                                
                                description: ()=> "<p>Sets a property based on the provided template.</p><p>By default this uses the <i><a href='http://mustache.github.io/mustache.5.html' target='_new'>mustache</a></i></p><p>For example, when a template of:<pre>Hello {{name}}. Today is {{date}}</pre><p>receives a message containing:<pre>{name: \"Fred\",date: \"Monday\" payload...}</pre><p>The resulting property will be:<pre>Hello Fred. Today is Monday</pre><p>By default, mustache will escape any HTML entities in the values it substitutes. To prevent this, use <code>{{{triple}}}</code> braces.",
                                
                                labelStyle: function() { 
                                    return this.name?"node_label_italic":"";
                                }
                            }
                          );
