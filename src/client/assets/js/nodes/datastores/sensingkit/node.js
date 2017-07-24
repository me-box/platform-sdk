import React, {PropTypes, Component} from 'react';
//import composeNode from 'utils/composeNode';
import Textfield from 'components/form/Textfield';
import Select from 'components/form/Select';
import Cell from 'components/Cell';
import Cells from 'components/Cells';
//import '../../../../style/sass/code.scss';
import {configNode} from 'utils/ReactDecorators';

@configNode()
export default class Node extends Component {
	
		componentDidMount(){
		
	   		if (this.props.values.sensor){
	   			//this.props.updateDescription(this.props.values.sensor);
	   			//this.props.updateOutputSchema(this.props.values.sensor);
	   			//this.props.fetchSampleData(this.props.values.sensor);
	   		}
	   	}
	   	
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

			const sensorprops = {
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
					this.props.updateNode("subtype", event.target.value);
				},
				style: {width: '100%'},
				value: this.props.values.subtype || "",
			}
			
			const sensorinput = <div className="centered">
							<Select {...sensorprops}/>												
						  </div>

			
          
        	return <Cells>									
						<Cell title={"name"} content={nameinput}/>
						<Cell title={"sensor"} content={sensorinput}/>
          			</Cells>
          		
          
       }
}