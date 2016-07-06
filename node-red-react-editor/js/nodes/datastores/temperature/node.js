import React from 'react';
import composeNode from '../../../utils/composeNode';
import Textfield from '../../../components/form/Textfield';
import Textarea from '../../../components/form/Textarea';
import Select from '../../../components/form/Select';
import Cell from '../../../components/Cell';
import Cells from '../../../components/Cells';


class Node extends React.Component {

       render() {
       		
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

		  	const descriptionprops = {	
									value: 	this.props.values.description || this.props.selected.name || "",
				 					id: "description",
									onChange:(property, event)=>{
                  						 this.props.updateNode(property, event.target.value);
              						}
								 }
			
			
		  	const descriptioninput 	= <Textarea {...descriptionprops}/>		
		
			const tagprops = {
				options: [
					                {name: 'TA', value: 'TA'},
					                {name: 'TB', value: 'TB'},
					                {name: 'TC', value: 'TC'},
					     ],
					     
				onSelect: (event)=>{
					this.props.updateNode("tag", event.target.value);
				},
				style: {width: '100%'},
				value: this.props.values.tag || this.props.selected.tag || "",
			}
			
			const taginput = <div className="centered">
							<Select {...tagprops}/>												
						  </div>

			
			
          
          return <div>
          			<Cells>									
						<Cell title={"name"} content={nameinput}/>
						<Cell title={"description"} content={descriptioninput}/>
						<Cell title={"tag"} content={taginput}/>
          			</Cells>
          		 </div>
          
       }
}

export default composeNode(Node, 'temperature', 
                            {
                                category: 'datastores',      
                                color: '#ffcc00',
                                defaults: {             
                                    name: {value:""},   //  along with default values.
           							description: {value:""},
            						tag: {value:"TA"},
                                },
                                inputs:0,               
                                outputs:1,             
                               
                                icon: "fa-sun-o",
                                unicode: '\uf185',     
                                label: function() {     
                                    return this.name||this.topic||"temperature";
                                },
                                labelStyle: function() { 
                                    return this.name?"node_label_italic":"";
                                },
                                description: "<p>Wireless things temperatures.  Data is of the form <code>{'value':21.8,'node':'XG','timestamp':'2016-06-27T13:16:52.954Z','unit':'degrees celcius','stream':'temperature'} </code></p>",


                            }
                          );