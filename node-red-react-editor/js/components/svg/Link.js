import React, { Component } from 'react';
import {NODE_HEIGHT, LINE_CURVE_SCALE} from '../../constants/ViewConstants';


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
        const dx = this.props.to.x - (this.props.from.x + sc * this.props.from.w/2);
        const delta = Math.sqrt(dy*dy+dx*dx);
        
        let scale =  LINE_CURVE_SCALE;
        let scaleY = 0;
        
        if (delta < this.props.from.w) {
            scale = 0.75-0.75*((this.props.from.w-delta)/this.props.from.w);
        }
        if (dx*sc < 0) {
            scale += 2*(Math.min(5*this.props.from.w,Math.abs(dx))/(5*this.props.from.w));
            if (Math.abs(dy) < 3*NODE_HEIGHT) {
                scaleY = ((dy>0)?0.5:-0.5)*(((3*NODE_HEIGHT)-Math.abs(dy))/(3*NODE_HEIGHT))*(Math.min(this.props.from.w,Math.abs(dx))/(this.props.from.w)) ;
            }
        }

        const x1 = this.props.from.x + (this.props.from.w/2) + 5;
        const x2 = this.props.to.x - (this.props.to.w/2) - 5;
        const y1 = this.props.from.y-7;
        const y2 = this.props.to.y;

        return  `M ${x1} ${(y1+portY)}`
              + `C ${(x1+sc*(this.props.from.w/2+this.props.from.w*scale))} ${(y1+portY+scaleY*NODE_HEIGHT)} `
              + `${(x2-sc*(scale)*this.props.from.w)} ${(y2-scaleY*NODE_HEIGHT)} `
              + `${x2} ${y2}`
    }   

    render(){
        const pathprops = {
            d: this._path(),
        }

        return <path className="drag_line" {...pathprops} />

    }
}