import React, { Component } from 'react';
import {NODE_WIDTH, NODE_HEIGHT, LINE_CURVE_SCALE} from '../../constants/ViewConstants';


export default class Link extends Component {

    constructor(props){
        super(props);
        this._path = this._path.bind(this);
    }

    _path(){
        const numOutputs = 0;
        const sourcePort = 0;
        const portY = -((numOutputs-1)/2)*13 +13*sourcePort;
        const sc = 1;
        const dy = this.props.to.y - (this.props.from.y + portY);
        const dx = this.props.to.x - (this.props.from.x + sc * NODE_WIDTH/2);
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

        const x1 = this.props.from.x + (NODE_WIDTH/2) + 14;
        const x2 = this.props.to.x - (NODE_WIDTH/2) - 14;
        const y1 = this.props.from.y-7;
        const y2 = this.props.to.y;

        return  `M ${x1} ${(y1+portY)}`
              + `C ${(x1+sc*(NODE_WIDTH/2+NODE_WIDTH*scale))} ${(y1+portY+scaleY*NODE_HEIGHT)} `
              + `${(x2-sc*(scale)*NODE_WIDTH)} ${(y2-scaleY*NODE_HEIGHT)} `
              + `${x2} ${y2}`
    }   

    render(){
        const pathprops = {
            d: this._path(),
        }

        return <path className="drag_line" {...pathprops} />

    }
}