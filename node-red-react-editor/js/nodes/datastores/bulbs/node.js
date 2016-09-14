import React from 'react';
import composeNode from '../../../utils/composeNode';
import Textfield from '../../../components/form/Textfield';
import Cell from '../../../components/Cell';
import Cells from '../../../components/Cells';

class Node extends React.Component {

       render() {
       
       	  
         const nameprops = {
              id: "name",
              value: 	this.props.values.name || "",
			  
              onChange: (property, event)=>{
                  this.props.updateNode(property, event.target.value);
              },
          }

		  const nameinput = <div className="centered">
								<Textfield {...nameprops}/>												
						  	</div>
          return  <div>
          			<Cells>	
          				<Cell title={"name"} content={nameinput}/>
          			</Cells>
            	  </div>
          
       }
}

export default composeNode(Node, 'bulbs', 
                            {
                                category: 'datastores',      
                                color: '#ffcc00',
                                defaults: {             
                                    name: {value:""},   
                                },
                                inputs:0,               
                                outputs:1,             
                                
                                schema: {
                                	value: {type:'numeric'},
                                	name:  {type:'string'},
                                	id:    {type:'string'},
                                },
                                
                                icon: "fa-lightbulb-o",
                                unicode: '\uf0eb',     
                                label: function() {     
                                    return this.name||"bulbs";
                                },
                                labelStyle: function() { 
                                    return this.name?"node_label_italic":"";
                                },
                                description: "<p>These Philips Hue lightbulb datastore will emit two events: <em> on </em> and <em> off </em>.</p> <p> We find that they are much easier to see when they are switched on.</p> <p>To control a Philips Hue white bulb, you need to have </p><ul><li>A. Philips Hue wireless dimming kit. You can add a Philips Hue white bulb to the Philips Hue dimmer switch for easy and instant control.</li><li> B. Philips Hue bridge and the Philips Hue app on your smart device will let you enjoy the full connected experience.</li></ul> <p>There are two ways to get a Philips Hue bridge.</p> <ul> <li>(1) You can get a starter kit that includes light bulbs and a bridge. </li><li>(2) You can get a separate bridge and build your own Philips Hue system around it.</li></ul>",


                            }
                          );