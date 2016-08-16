import React, { Component } from 'react';
import {NODE_WIDTH, NODE_HEIGHT, LINE_CURVE_SCALE, OUTPUT_GAP} from '../../constants/ViewConstants';


export default class Wire extends Component {

    constructor(props){
        super(props);
        this._path = this._path.bind(this);
    }

    _path(){
        const numOutputs = 0;
        const sourcePort = 0;
        const portY = -((numOutputs-1)/2)*OUTPUT_GAP +OUTPUT_GAP*sourcePort;
        const sc = 1;
        const dy = this.props.target.y - (this.props.source.y + portY);
        const dx = this.props.target.x - (this.props.source.x + sc * NODE_WIDTH/2);
        const delta = Math.sqrt(dy*dy+dx*dx);
        
        let scale =  LINE_CURVE_SCALE;
        let scaleY = 0;
        
        if (delta < NODE_WIDTH) {
            scale = 0.75-0.75*((NODE_WIDTH-delta)/NODE_WIDTH);
        }
        if (dx*sc < 0) {
            scale += 2*(Math.min(5*NODE_WIDTH,Math.abs(dx))/(5*NODE_WIDTH));
            if (Math.abs(dy) < 3*NODE_HEIGHT) {
                scaleY = ((dy>0)?0.5:-0.5)*(((3*NODE_HEIGHT)-Math.abs(dy))/(3*NODE_HEIGHT))*(Math.min(NODE_WIDTH,Math.abs(dx))/(NODE_WIDTH)) ;
            }
        }
        return  `M ${this.props.source.x} ${(this.props.source.y+portY)}`
              + `C ${(this.props.source.x+sc*(NODE_WIDTH/2+NODE_WIDTH*scale))} ${(this.props.source.y+portY+scaleY*NODE_HEIGHT)} `
              + `${(this.props.target.x-sc*(scale)*NODE_WIDTH)} ${(this.props.target.y-scaleY*NODE_HEIGHT)} `
              + `${this.props.target.x} ${this.props.target.y}`
    }   

    render(){
    
		
        const pathprops = {
            d: this._path(),
            
        }

        return <path className="drag_line" {...pathprops} />

    }
}