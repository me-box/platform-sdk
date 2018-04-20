import React, { Component } from 'react';
import {LINE_CURVE_SCALE, OUTPUT_WIDTH, OUTPUT_GAP} from 'constants/ViewConstants';
import cx from 'classnames';
import {actionCreators as linkActions, selector} from 'features/ports';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';


const _colours = {
    "i": "#3771c8",
    "p" : "#E65100",
    "s" : "#B71C1C",
}

const _ordinals = {
    "primary": 1,
    "secondary":2,
}

const warnings = ["export"];

const warn = (target)=>{
    return warnings.indexOf(target.type) != -1;
}

const badge = (source, sport, target, ptype, onClick)=>{

    if (Object.keys(ptype || {}).length <= 0){
      return null;
    }

    const _t = Object.keys(ptype || {}).reduce((acc, key)=>{
        const item = ptype[key];

        return item.reduce((acc, item)=>{
            const ordinalnum = _ordinals[item.ordinal] || -1;
            if ((acc[item.type] || []).indexOf(ordinalnum) == -1){
                acc[item.type] = [...(acc[item.type] || []), ordinalnum];
            }
            return acc;                   
        },acc);
    },{});



    const ordinals = Object.keys(_t).reduce((acc, key)=>{
        const ordinalarray = _t[key];
        if (ordinalarray.length == 1){
            acc[key] = ordinalarray[0];
        }else{
            acc[key] = "*";
        }
        return acc;
    },{});

    const types = Object.keys(ordinals).map((key)=>{
        const suffix = ordinals[key];
        return `${key[0]}${suffix}`;
    })

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
 
    const _r = 10;
    const _center_r = warn(target) ? _r : _r;

    const _cx1 = x1+(source.w*scale);
    const _cx2 = x2-scale*source.w;
    const _cy1 = y1+portY;
    const _cy2 = y2;
    const _cx = _cx1 + (_cx2-_cx1)/2
    const _cy = _cy2 - (_cy2-_cy1)/2
    
    

    const privateicon = '\uf06e';
    const gap = 2;
    const delta = (_r * (types.length-1)) + (gap * types.length);

    const theta = 120 * Math.PI/180;
    
    const circlecenterstyle = {
        stroke:warn(target) ? "none" : "#fff",
        strokeWidth:2,
        fill: warn(target) ? "white" : "#ddd" 
    }
    
    const linestyle = {
        stroke:"#888", 
        strokeWidth:2,
    }

    const circles = types.map((t, i)=>{

        

        const _dcx = 25 * Math.sin(theta*i);
        const _dcy = 25 * Math.cos(theta*i);

        //const _dcy = _cy-delta + (i * 2 * _r) + ((i+1)*gap) + gap/2

        const textprops = {
            x:_cx+_dcx,
            y:_cy+_dcy+3,

        }

       

        const circlestyle = {
            stroke:"#fff",
            strokeWidth:2,
            fill: _colours[t[0]]
        }

        return  <g onClick={onClick}>
                    <line x1={_cx} y1={_cy} x2={_cx+_dcx} y2={_cy+_dcy} style={linestyle}/>
                    <circle cx={_cx+_dcx} cy={_cy+_dcy} r={_r} style={circlestyle} />
                    <text className="badge" {...textprops}>{t}</text>
                </g>
    });

    const warningprops = {
            x: _cx,
            y: _cy+4,
            fill: "white",
            fontWeight: "bold"
    }
    const icontxt =  '\uf06a'

    return  <g>
                 
                {circles}      
                {circles.length > 0 && <circle cx={_cx} cy={_cy} r={_center_r/2}  style={circlecenterstyle}/>}
                {circles.length > 0 && warn(target) && <text className="warning" {...warningprops}>{icontxt}</text>}
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
        const {id, link:{source,target,sourcePort}}  = this.props;
        const onclick = ()=>{this.props.actions.linkSelected(id)}
        const ptype = source.schema && source.schema.output && source.schema.output.ptype ? source.schema.output.ptype : [];
       

        return badge(source, sourcePort, target, ptype, onclick)
    }
}