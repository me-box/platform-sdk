import React, { Component } from 'react';
import {NODE_HEIGHT, LINE_CURVE_SCALE, OUTPUT_WIDTH, OUTPUT_GAP} from 'constants/ViewConstants';
import cx from 'classnames';
import {actionCreators as linkActions, selector} from 'features/ports';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';



const path =(source, sport, target)=>{
    const outputradius = OUTPUT_WIDTH/2;
    const numOutputs = source.outputs || 1;
    const sourcePort = sport || 0;
    const portY = -((numOutputs-1)/2)*OUTPUT_GAP + OUTPUT_GAP*sourcePort;
    const sc = 1;
    const dy = target.y - (source.y + portY);
    const dx = target.x - (source.x + sc * source.w/2);
    const delta = Math.sqrt(dy*dy+dx*dx);
    
    let scale =  LINE_CURVE_SCALE;
    let scaleY = 0;
    
    if (delta < source.w) {
        scale = 0.75-0.75*((source.w-delta)/source.w);
    }
    if (dx*sc < 0) {
        scale += 2*(Math.min(outputradius*source.w,Math.abs(dx))/(outputradius*source.w));
        if (Math.abs(dy) < 3*NODE_HEIGHT) {
            scaleY = ((dy>0)?0.5:-0.5)*(((3*NODE_HEIGHT)-Math.abs(dy))/(3*NODE_HEIGHT))*(Math.min(source.w,Math.abs(dx))/(source.w)) ;
        }
    }

    const x1 = source.x + (source.w/2) + outputradius;
    const x2 = target.x - (target.w/2) - outputradius;
    const y1 = source.y;
    const y2 = target.y;

    // 
    return `M ${x1} ${(source.y+portY)}`
          + `C ${(x1+sc*(source.w/2+source.w*scale))} ${(y1+portY+scaleY*NODE_HEIGHT)} `
          + `${(x2-sc*(scale)*source.w)} ${(y2-scaleY*NODE_HEIGHT)} `
          + `${x2} ${y2}`
}


@connect(selector, (dispatch) => {
  return{
     actions: {...bindActionCreators(linkActions, dispatch)},
  }
})
export default class Link extends Component {

    constructor(props){
        super(props);
    }    

    render(){
    
        const {id, link, link:{source,target,sourcePort}, selectedId}  = this.props;

        const DELTA = (source.w/2) + OUTPUT_WIDTH/2;
        
        const xpos = ()=>{
         	if ( (source.x + NODE_HEIGHT) > target.x){
         		return target.x - DELTA;
         	}
         	return source.x + DELTA;
        }
         
        const w = ()=>{
         	if ( (source.x + NODE_HEIGHT) > target.x){
         		return Math.max(10,source.x - target.x + (2*DELTA));
         	}
         	return Math.max(10,target.x - source.x - (2*DELTA));
        }
         
         
        const clickrectprops = {
            fill: 'transparent',
            x:  xpos(),
            
            y: Math.min(source.y, target.y),
            
            width: w(),
            
            height: Math.abs(target.y - source.y),
            
            onClick: this.props.actions.linkSelected.bind(null, link),
        };

		const className = cx({
			'link_line' : !selectedId,
			'drag_line' : selectedId,
		});
		
        return <g>
        			<rect {...clickrectprops} ></rect>
        			<path className={className} d={path(source, sourcePort, target)} />
        	   </g>
    }
}