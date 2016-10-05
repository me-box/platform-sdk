import React from 'react';
import composeNode from '../../../utils/composeNode';
import Textfield from '../../../components/form/Textfield';
import Textarea from '../../../components/form/Textarea';
import Select from '../../../components/form/Select';
import Cell from '../../../components/Cell';
import Cells from '../../../components/Cells';
import '../../../../style/sass/code.scss';

class Node extends React.Component {

       render() {
       		
         	const nameprops = {	
								value: 	this.props.values.name || "",
				 				id: "name",
								onChange:(property, event)=>{
                  					 this.props.updateNode(property, event.target.value);
              					}
							}
							
        	const nameinput = <div className="centered">
							<Textfield {...nameprops}/>												
						  </div>

			const subtypeprops = {
				options: [
					                {name: 'bluetooth', value: 'bluetooth'},
					                {name: 'audio-level', value: 'audio-level'},
					                {name: 'accelerometer', value: 'accelerometer'},
					                {name: 'linear-acceleration', value: 'linear-acceleration'},
					                {name: 'magnetometer', value: 'magnetometer'},
					                {name: 'light', value: 'light'},
									{name: 'rotation', value: 'rotation'},
									{name: 'gravity', value: 'gravity'},
									{name: 'gyroscope', value: 'gyroscope'},
									{name: 'battery', value: 'battery'},
					     ],
					     
				onSelect: (event)=>{
					console.log(event.target.value);
					this.props.updateDescription(event.target.value);
					this.props.updateNode("subtype", event.target.value);
				},
				style: {width: '100%'},
				value: this.props.values.subtype || "",
			}
			
			const subtypeinput = <div className="centered">
							<Select {...subtypeprops}/>												
						  </div>

			
          
        	return <Cells>									
						<Cell title={"name"} content={nameinput}/>
						<Cell title={"subtype"} content={subtypeinput}/>
          			</Cells>
          		
          
       }
}

export default composeNode(Node, 'sensingkit', 
                            {
                                category: 'datastores',      
                                
                                color: '#ffcc00',
                                
                                defaults: {             
                                    name: {value:""}, 
            						type: {value:"sensingkit"},
            						subtype: {value: "light"},
                                },
                                
                                schema: (subtype)=>{
                                	
                                	
                                	switch (subtype){
                                	
                                		case "bluetooth":
                                			return {
                                						ts: {type:'time'},
                                						name:  {type:'string'},
                                						address: {type:'string'},
                                						rssi: {type:'numeric'},	
                                			};
                                			
                                		
                                		case "accelerometer":
                                		case "linear-acceleration":
                                		case "magnetometer":
                                		case "gravity":
                                		case "gyroscope":
                                			return {
                                						ts: {type:'time'},
                                						x:  {type:'numeric'},
                                						y:  {type:'numeric'},
                                						z:  {type:'numeric'},	
                                			};
                                		
                                		case "rotation":
                                			return {
                                						ts: {type:'time'},
                                						x:  {type:'numeric'},
                                						y:  {type:'numeric'},
                                						z:  {type:'numeric'},	
                                						cos:  {type:'numeric'},	
                                						headingAccuracy:  {type:'numeric'},	
                                			};
                                			
                                		
                                		case "battery":
                                			return {
                                						ts: {type:'time'},
                                						charge:  {type:'numeric'},
                                						temperature:  {type:'numeric'},
                                						voltage:  {type:'numeric'},	
                                						plugged:  {type:'string'},	
                                						status:  {type:'string'},
                                						health: {type:'string'},	
                                			};
                                			
                                		case "audio-level":
                                		case "light":
                                			return {
                                						ts:  {type:'time'},
                                						value: {type:'numeric'},
                                						
                                					};
                                		default:
                                			return {};
                                	}
                                },
                                
                                inputs:0,               
                                outputs:1,             
                               
                                icon: "fa-android",
                                unicode: '\uf17b',     
                                label: function() {     
                                    return this.name||"sensingkit";
                                },
                                labelStyle: function() { 
                                    return this.name?"node_label_italic":"";
                                },
                                description: (subtype)=>{
                                	return "<p>Android mobile sensingkit<code>{}</code></p>";
                                }


                            }
                          );
