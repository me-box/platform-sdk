import React, { Component } from 'react';
import {LINE_CURVE_SCALE, OUTPUT_WIDTH, OUTPUT_GAP} from 'constants/ViewConstants';
import cx from 'classnames';
import {actionCreators as linkActions, selector} from 'features/ports';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';


const _colours = {
    "identifier": "#3771c8",
    "personal" : "#E65100",
    "sensitive" : "#B71C1C",
}

const badge = (source, sport, target, ptype, onClick)=>{

    if (ptype.length <= 0){
      return null;
    }

    console.log("badge, got ptype", ptype);
    
    const _t = Object.keys(ptype || {}).reduce((acc, key)=>{
        const item = ptype[key];
        return {
            ...acc, 
            ...item.reduce((acc,item)=>{
                return {...acc, [item.type]:true}
            },{})
        }
    },{});

    console.log("_t is", _t)

    const types = Object.keys(_t);
    /*Object.keys(ptype.reduce((acc, item)=>{
        acc[item.type] = true;
        return acc;
    },{}));*/

    

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
 
    const _r = 8
    const _cx1 = x1+(source.w*scale);
    const _cx2 = x2-scale*source.w;
    const _cy1 = y1+portY;
    const _cy2 = y2;
    const _cx = _cx1 + (_cx2-_cx1)/2
    const _cy = _cy2 - (_cy2-_cy1)/2
    
    

    const privateicon = '\uf06e';
    const gap = 2;
    const delta = (_r * (types.length-1)) + (gap * types.length);

    /*const circles = types.map((t, i)=>{

        const _dcy = _cy-delta + (i * 2 * _r) + ((i+1)*gap) + gap/2

        const textprops = {
            x:_cx,
            y:_dcy+3,
        }

        const circlestyle = {
            stroke:"#fff",
            strokeWidth:2,
            fill: _colours[t]
        }

        return  <g>
                    <circle cx={_cx} cy={_dcy} r={_r} style={circlestyle} />
                    <text className="badge" {...textprops}>{t[0]}</text>
                </g>
    });*/
    const theta = 120 * Math.PI/180;
    
    const circlecentestyle = {
        stroke:"#fff",
        strokeWidth:2,
        fill: "#ddd"
    }
    
    const linestyle = {
        stroke:"#888", 
        strokeWidth:2,
    }

    const circles = types.map((t, i)=>{

        

        const _dcx = 20 * Math.sin(theta*i);
        const _dcy = 20 * Math.cos(theta*i);

        //const _dcy = _cy-delta + (i * 2 * _r) + ((i+1)*gap) + gap/2

        const textprops = {
            x:_cx+_dcx,
            y:_cy+_dcy+3,
        }

        const circlestyle = {
            stroke:"#fff",
            strokeWidth:2,
            fill: _colours[t]
        }

        return  <g onClick={onClick}>
                    <line x1={_cx} y1={_cy} x2={_cx+_dcx} y2={_cy+_dcy} style={linestyle}/>
                    <circle cx={_cx+_dcx} cy={_cy+_dcy} r={_r} style={circlestyle} />
                    <text className="badge" {...textprops}>{t[0]}</text>
                </g>
    });

    return  <g>
                 
                {circles}      
                <circle cx={_cx} cy={_cy} r={_r/2}  style={circlecentestyle}/>
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