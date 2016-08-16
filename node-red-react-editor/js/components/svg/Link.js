import React, { Component } from 'react';
import {NODE_HEIGHT, LINE_CURVE_SCALE, OUTPUT_WIDTH, OUTPUT_GAP} from '../../constants/ViewConstants';
import cx from 'classnames';

export default class Link extends Component {

    constructor(props){
        super(props);
        this._path = this._path.bind(this);
    }

	_path(){
    	const outputradius = OUTPUT_WIDTH/2;
        const numOutputs = this.props.source.outputs || 1;
        const sourcePort = this.props.sourcePort || 0;
        const portY = -((numOutputs-1)/2)*OUTPUT_GAP + OUTPUT_GAP*sourcePort;
        const sc = 1;
        const dy = this.props.target.y - (this.props.source.y + portY);
        const dx = this.props.target.x - (this.props.source.x + sc * this.props.source.w/2);
        const delta = Math.sqrt(dy*dy+dx*dx);
        
        let scale =  LINE_CURVE_SCALE;
        let scaleY = 0;
        
        if (delta < this.props.source.w) {
            scale = 0.75-0.75*((this.props.source.w-delta)/this.props.source.w);
        }
        if (dx*sc < 0) {
            scale += 2*(Math.min(outputradius*this.props.source.w,Math.abs(dx))/(outputradius*this.props.source.w));
            if (Math.abs(dy) < 3*NODE_HEIGHT) {
                scaleY = ((dy>0)?0.5:-0.5)*(((3*NODE_HEIGHT)-Math.abs(dy))/(3*NODE_HEIGHT))*(Math.min(this.props.source.w,Math.abs(dx))/(this.props.source.w)) ;
            }
        }

        const x1 = this.props.source.x + (this.props.source.w/2) + outputradius;
        const x2 = this.props.target.x - (this.props.target.w/2) - outputradius;
        const y1 = this.props.source.y;
        const y2 = this.props.target.y;

		// 
        return `M ${x1} ${(this.props.source.y+portY)}`
              + `C ${(x1+sc*(this.props.source.w/2+this.props.source.w*scale))} ${(y1+portY+scaleY*NODE_HEIGHT)} `
              + `${(x2-sc*(scale)*this.props.source.w)} ${(y2-scaleY*NODE_HEIGHT)} `
              + `${x2} ${y2}`
    }
    

    render(){
    
        const pathprops = {
            d: this._path(),
        }
        
         
         const DELTA = (this.props.source.w/2) + OUTPUT_WIDTH/2;
        
         const xpos = ()=>{
         	if ( (this.props.source.x + NODE_HEIGHT) > this.props.target.x){
         		return this.props.target.x - DELTA;
         	}
         	return this.props.source.x + DELTA;
         }
         
         const w = ()=>{
         	if ( (this.props.source.x + NODE_HEIGHT) > this.props.target.x){
         		return Math.max(10,this.props.source.x - this.props.target.x + (2*DELTA));
         	}
         	return Math.max(10,this.props.target.x - this.props.source.x - (2*DELTA));
         }
         
         
         const clickrectprops = {
            fill: 'transparent',
            x:  xpos(),
            
            y: Math.min(this.props.source.y, this.props.target.y),
            
            width: w(),
            
            height: Math.abs(this.props.target.y - this.props.source.y),
            
            onClick: this.props.onClick,
        };

		const className = cx({
			'link_line' : !this.props.selected,
			'drag_line' : this.props.selected,
		});
		
        return <g>
        			<rect {...clickrectprops} ></rect>
        			<path className={className} {...pathprops} />
        	   </g>
        
        

    }
}