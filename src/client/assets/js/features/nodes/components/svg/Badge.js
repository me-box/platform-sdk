import React, { Component, PropTypes } from 'react';

export default class Badge extends Component {
  
  constructor(props){
    super(props);
    this._badgeClicked = this._badgeClicked.bind(this);
  }


  _badgeClicked(d,e){
    d._def.onbadgeclick.call(d);
    //d3.event.preventDefault();}
  }

  render() {
          const {d} = this.props;
          
          if (!d._def.badge){   
              return null;
          }

          const badgeprops = {
            rx: 5,
            ry: 5,
            width: 40,
            height: 15,
          }
          const textprops = {
            x: 35,
            y: 11,
            textAnchor: 'end',
          }

          return (<g className="node_badge_group" onClick={this._badgeClicked.bind(this, d)}>
                  <rect className="node_badge" {...badgeprops}></rect>
                  <text className="node_badge_label" {...textprops}> {d._def.badge()}</text>
                 </g>)                
  }
}