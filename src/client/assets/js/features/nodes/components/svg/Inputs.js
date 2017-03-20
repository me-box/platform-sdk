import React, { Component, PropTypes } from 'react';
import { bindActionCreators } from 'redux';


export default class Inputs extends Component {
  
  constructor(props){
    super(props); 
  }

  render() {
      
      const {d, portMouseDown, portMouseOver} = this.props;

		  if (!d._def.inputs){   
        return null;
      }

      const gprops = {
      	transform: `translate(0,${( (d.h/2))})`,
      }

      const portprops = {
        key: `${d.id}`,
      	cx:0,
      	cy:0,
      	r:5,
      	onMouseDown: portMouseDown.bind(null, d, 1, 0),
      	onTouchStart: portMouseDown.bind(null, d, 1, 0),
      	onMouseOver: portMouseOver.bind(null,d,1,0),
      }
      
      return (<g className="port_input" {...gprops}>
              	<circle className="port" {...portprops}></circle>
             </g>)                
  }
}