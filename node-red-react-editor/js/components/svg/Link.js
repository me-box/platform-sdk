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
        const dy = this.props.target.y - (this.props.source.y + portY);
        const dx = this.props.target.x - (this.props.source.x + sc * this.props.source.w/2);
        const delta = Math.sqrt(dy*dy+dx*dx);
        
        let scale =  LINE_CURVE_SCALE;
        let scaleY = 0;
        
        if (delta < this.props.source.w) {
            scale = 0.75-0.75*((this.props.source.w-delta)/this.props.source.w);
        }
        if (dx*sc < 0) {
            scale += 2*(Math.min(5*this.props.source.w,Math.abs(dx))/(5*this.props.source.w));
            if (Math.abs(dy) < 3*NODE_HEIGHT) {
                scaleY = ((dy>0)?0.5:-0.5)*(((3*NODE_HEIGHT)-Math.abs(dy))/(3*NODE_HEIGHT))*(Math.min(this.props.source.w,Math.abs(dx))/(this.props.source.w)) ;
            }
        }

        const x1 = this.props.source.x + (this.props.source.w/2) + 5;
        const x2 = this.props.target.x - (this.props.target.w/2) - 5;
        const y1 = this.props.source.y-7;
        const y2 = this.props.target.y;

        return  `M ${x1} ${(y1+portY)}`
              + `C ${(x1+sc*(this.props.source.w/2+this.props.source.w*scale))} ${(y1+portY+scaleY*NODE_HEIGHT)} `
              + `${(x2-sc*(scale)*this.props.source.w)} ${(y2-scaleY*NODE_HEIGHT)} `
              + `${x2} ${y2}`
    }   

    render(){
        const pathprops = {
            d: this._path(),
        }

        return <path className="drag_line" {...pathprops} />

    }
}