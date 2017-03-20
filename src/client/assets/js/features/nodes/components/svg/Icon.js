import React, { Component, PropTypes } from 'react';
import className from 'classnames';
export default class Icon extends Component {
  
  constructor(props){
    super(props);
    
  }

  render() {
       const {d} = this.props;
         
        if (!d._def.icon){   
          return null;
        }
        /*
        var img = new Image();
        img.src = "icons/"+d._def.icon;
        img.onload = function() {
            icon.attr("width",Math.min(img.width,30));
            icon.attr("height",Math.min(img.height,30));
            icon.attr("x",15-Math.min(img.width,30)/2);
          
        }*/

        //icon_group.style("pointer-events","none");    

        const gprops = {
          x:0,
          y:0,
        }

        const iconshadeprops ={
          x:0,
          y:0,
          width: 30,
          stroke: "none",
          fill: "#000",
          fillOpacity: "0.05",
          height: Math.min(50,d.h-4),
        }

        const icongroupclass = className({
            node_icon_group: true,
            node_icon_group_right: d._def.align=="right",
        });

        const icongroupprops = {
           xlinkHref : `icons/${d._def.icon}`,
           x: 0,
           width: 30,
           height: 30, 
           transform: `translate(${(d.w-30)},0)`,
        }

        const icongroupstyle={
          pointerEvents:"none"
        }

        const iconshadeborderprops = {
          d: d._def.align == "right" ? `M 0 1 l 0 ${(d.h-2)}` : `M 30 1 l 0 ${(d.h-2)}`,
          strokeOpacity: "0.1",
          stroke: "#000",
          strokeWidth: "1",
        }

        return <g className={icongroupclass} {...icongroupprops} style={icongroupstyle}>
                  <rect className="node_icon_shade" {...iconshadeprops}/>
                  <image className="node_icon"/>
                  <path className="node_icon_shade_border" {...iconshadeborderprops}/>
                </g>
        
  }
}