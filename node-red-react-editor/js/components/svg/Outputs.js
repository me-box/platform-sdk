
import React, { Component, PropTypes } from 'react';
import {range} from '../../utils/utils';
import { bindActionCreators } from 'redux';
import {portMouseUp} from '../../actions/PortMouseActions';
import {portMouseDown} from '../../actions/PortMouseActions';
import {portMouseOver} from '../../actions/PortMouseActions';
import {portMouseOut} from '../../actions/PortMouseActions';

import { connect } from 'react-redux';
import Wire from  './Wire';
import {OUTPUT_WIDTH} from '../../constants/ViewConstants';

class Outputs extends Component {
  
  constructor(props){
    super(props);
    this._portMouseUp = bindActionCreators(portMouseUp, props.dispatch).bind(this);
    this._portMouseDown = bindActionCreators(portMouseDown, props.dispatch).bind(this);
    this._portMouseOver = bindActionCreators(portMouseOver, props.dispatch).bind(this);
    this._portMouseOut =  bindActionCreators(portMouseOut, props.dispatch).bind(this);

  }

  render() {
          

          const {drawingPort, activeLink, d} = this.props;

          if (!d._def.outputs){
            return null;
          }
          
          const numOutputs = d.outputs || 1;
          const y = (d.h/2)-((numOutputs-1)/2)*13;
          const x = d.w - 5;
          let wire;

          if (drawingPort && drawingPort.id === d.id){
            wire =  <Wire {...activeLink}/>
          }
          const outputs = range(numOutputs).map((port, i)=>{
            const gprops = {
              key: `${d.id}${i}`,
              transform: `translate(${x}, ${(y+13*i)-5})`,
            }
            const portprops = {
              key: `${d.id}${i}`,
              rx:3,
              ry:3,
              width:OUTPUT_WIDTH,
              height:OUTPUT_WIDTH,
              onMouseDown: this._portMouseDown.bind(this, d, 0, i),
              onTouchStart: this._portMouseDown.bind(this, d, 0, i),
              onMouseUp:this._portMouseUp.bind(this, d, 0, i),
              onTouchEnd:this._portMouseUp.bind(this, d, 0, i),
              onMouseOver: this._portMouseOver.bind(this,d, 0, i),
              onMouseOut: this._portMouseOut.bind(this,d, 0, i),
            }
            return  <g className="port_output" {...gprops}>
                      <rect className="port" {...portprops}></rect>
                     {wire}
                    </g>
          })


          return <g>{outputs}</g>
  }
}

function select(state) {
  return {
    activeLink: state.ports.activeLink,
    drawingPort: state.ports.drawingPort,
  };
}

export default connect(select)(Outputs)