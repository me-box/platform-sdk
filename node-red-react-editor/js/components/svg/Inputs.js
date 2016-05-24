
import React, { Component, PropTypes } from 'react';
import { bindActionCreators } from 'redux';
import {portMouseUp} from '../../actions/PortMouseActions';
import {portMouseDown} from '../../actions/PortMouseActions';
import {portMouseOver} from '../../actions/PortMouseActions';
import {portMouseOut} from '../../actions/PortMouseActions';
import { connect } from 'react-redux';
class Inputs extends Component {
  
  constructor(props){
    super(props);

    this._portMouseUp = bindActionCreators(portMouseUp, props.dispatch).bind(this);
    this._portMouseDown = bindActionCreators(portMouseDown, props.dispatch).bind(this);
    this._portMouseOver = bindActionCreators(portMouseOver, props.dispatch).bind(this);
    this._portMouseOut =  bindActionCreators(portMouseOut, props.dispatch).bind(this);
  }

  render() {
          const {d} = this.props;
		 
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
          	onMouseDown: this._portMouseDown.bind(this, d, 1, 0),
          	onTouchStart: this._portMouseDown.bind(this, d, 1, 0),
          	onMouseUp:this._portMouseUp.bind(this, d, 1, 0),
          	onTouchEnd:this._portMouseUp.bind(this, d, 1, 0),
          	onMouseOver: this._portMouseOver.bind(this,d,1,0),
          	onMouseOut: this._portMouseOut.bind(this,d,1,0),
          }
          

          return (<g className="port_input" {...gprops}>
                  	<circle className="port" {...portprops}></circle>
                 </g>)                
  }
}

function select(state) {
  return {};
}

export default connect(select)(Inputs)