
import React, { Component, PropTypes } from 'react';
import {range} from 'utils/utils';
import { bindActionCreators } from 'redux';
import {actionCreators as portActions} from 'features/ports';
import { connect } from 'react-redux';
import Wire from  './Wire';
import {OUTPUT_WIDTH} from 'constants/ViewConstants';

class Outputs extends Component {
  
  constructor(props){
    super(props);
    this.portMouseDown = bindActionCreators(portActions.portMouseDown, props.dispatch);
    this.portMouseOver   = bindActionCreators(portActions.portMouseOver, props.dispatch); 
  }

  render() {
	              
    const {output, activeLink, d, outputs} = this.props;
	
	if (!outputs){
		return null;
	}
	
    const numOutputs = outputs || 0;
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
        onMouseOver: this.portMouseOver.bind(this,d, 0, i),
      }

	  const selected = (output && output.node.id === d.id && output.sourcePort == i);
	
	 	
      
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