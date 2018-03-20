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
 
    return `M ${x1} ${source.y+portY}`
          + `C ${x1+(source.w*scale)} ${y1+portY} `
          + `${x2-scale*source.w} ${y2} `
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
    
        const {id, link, link:{source,target,sourcePort}, ports:{selectedId}}  = this.props;
        
   

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
            
            onClick: this.props.actions.linkSelected.bind(null, id),
        };

       
		    
        const className = cx({
			   'link_line' : !(selectedId === id),
			   'drag_line' : (selectedId === id),
		    });
		
        return <g>
        			<rect {...clickrectprops} ></rect>
        			<path className={className} d={path(source, sourcePort, target)} />
        	   </g>
    }
}