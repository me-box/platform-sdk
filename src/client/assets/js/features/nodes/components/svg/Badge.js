import React, { Component } from 'react';
import {LINE_CURVE_SCALE, OUTPUT_WIDTH, OUTPUT_GAP} from 'constants/ViewConstants';
import cx from 'classnames';
import {actionCreators as linkActions, selector} from 'features/ports';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';


const circle = (source, sport, target, ptype)=>{

    if (ptype.length <= 0){
      return null;
    }

    const outputradius = OUTPUT_WIDTH/2;
    const numOutputs = source.outputs || 1;
    const sourcePort = sport || 0;
    const portY = -((numOutputs-1)/2)*OUTPUT_GAP + OUTPUT_GAP*sourcePort;
   
    const dy = target.y - (source.y + portY);
    const dx = target.x - (source.x + source.w);
  
    let scale =  LINE_CURVE_SCALE;
    
    if (dx < 0) {
        scale += 2*(Math.min(outputradius*source.w,Math.abs(dx))/(outputradius*source.w));
    }

    const x1 = source.x + (source.w/2) + outputradius;
    const x2 = target.x - (target.w/2) - outputradius;
    const y1 = source.y;
    const y2 = target.y;
 
    const _r = 10
    const _cx1 = x1+(source.w*scale);
    const _cx2 = x2-scale*source.w;
    const _cy1 = y1+portY;
    const _cy2 = y2;
    const _cx = _cx1 + (_cx2-_cx1)/2
    const _cy = _cy2 - (_cy2-_cy1)/2
    
    const textprops = {
      x:_cx,
      y:_cy+_r/2,
    }

    const privateicon = '\uf06e';
   
    return  <g>
              <circle cx={_cx} cy={_cy} r={_r} stroke="#ddd" fill="#888"/>
              <text className="badge" {...textprops}>{privateicon}</text>
            </g>
}

@connect(selector, (dispatch) => {
  return{
     actions: {...bindActionCreators(linkActions, dispatch)},
  }
})
export default class Badge extends Component {

    constructor(props){
        super(props);
    }    

    render(){
        const {link:{source,target,sourcePort}}  = this.props;
        const ptype = source.schema && source.schema.output && source.schema.output.ptype ? source.schema.output.ptype : [];
        return circle(source, sourcePort, target, ptype)
    }
}