
import React, { Component, PropTypes } from 'react';
import {range} from '../../utils/utils';
import { bindActionCreators } from 'redux';
import * as PortMouseActions from '../../actions/PortMouseActions';

import { connect } from 'react-redux';
import Wire from  './Wire';
import {OUTPUT_WIDTH} from '../../constants/ViewConstants';

class Outputs extends Component {
  
  constructor(props){
    super(props);
    Object.assign(  this, 
              ...bindActionCreators(PortMouseActions, props.dispatch),          
    );
  }

  render() {
              
    const {output, activeLink, d, outputs} = this.props;

   
    const numOutputs = outputs || 1;
    const y = (d.h/2)-((numOutputs-1)/2)*13;
    const x = d.w;
    
    const ports = range(numOutputs).map((port, i)=>{
      const gprops = {
        key: `${d.id}${i}`,
        transform: `translate(${x}, ${(y+13*i)})`,
      }
      const portprops = {
        key: `${d.id}${i}`,
        cx: 0,
        cy: 0,
        r:5,
        width:OUTPUT_WIDTH,
        height:OUTPUT_WIDTH,
        onMouseDown: this.portMouseDown.bind(this, d, 0, i),
        onTouchStart: this.portMouseDown.bind(this, d, 0, i),
        onMouseUp:this.portMouseUp.bind(this, d, 0, i),
        onTouchEnd:this.portMouseUp.bind(this, d, 0, i),
        onMouseOver: this.portMouseOver.bind(this,d, 0, i),
        onMouseOut: this.portMouseOut.bind(this,d, 0, i),
      }

	  const selected = (output && output.node.id === d.id && output.sourcePort == i);
	console.log(output);
	  console.log("selected is ");
	  console.log(selected);
	  
	  //console.log(`checking drawing port id ${output.node.id} against d.id ${d.id} and portIndex ${output.portIndex} against ${i} : ${selected}`); 
      	
      
      return  <g className="port_output" {...gprops}>
                <circle className="port" {...portprops}></circle>
                {selected && <Wire {...activeLink}/>}
              </g>
    })


    return <g>{ports}</g>
  }
}

function select(state) {
  return {
    activeLink: state.ports.activeLink,
    output: state.ports.output,
    dirty: state.nodes.selected,  //force this to redraw when an output dialogue has been ok'd
  };
}

export default connect(select)(Outputs)