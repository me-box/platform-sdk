import React, { Component, PropTypes } from 'react';

//import { bindActionCreators } from 'redux';
//import { connect } from 'react-redux';
import cx from 'classnames';
const colours = ["#78909C","#607D8B","#546E7A","#455A64","#37474F","#263238"];
const lookup = [];

const _colourFor = (id)=>{
	let index = lookup.indexOf(id);

  	if (index === -1){
     	lookup.push(id);
     	index = lookup.length - 1;
  	}
	
  	return colours[index%colours.length];
}

class LayoutManager extends Component {
 
  constructor(props){
    super(props);
    this._onMouseDown = this._onMouseDown.bind(this);
   
  } 

  render() {
	  
      const {local, w, h} = this.props;
      const {boxes, moving} = local;
      
      const BOXWIDTH = w/boxes.length;

      const MAXROWS = boxes.length;
     

      const MAXCOLS = boxes.reduce((acc,row)=>{
        return Math.max(acc, row.length);
      }, 0)

      const boxh = h/MAXROWS;

      const b = boxes.map((row, i)=>{
          //const box = boxes[key];
          

          return row.map((box, j)=>{
            const boxw = w / row.length;
            const ammoving = moving && moving.name === box.name
            const top = ammoving? moving.top :  (i * boxh);
            const left = ammoving ? moving.left :  j * boxw;


            const style = {
              position: 'absolute',
              top: top,
              left: left,
              width: boxw,
              height: boxh,
              background: _colourFor(box.name),
              color: 'white',
              zIndex: ammoving ? 99999: 1,
              opacity: ammoving ? 0.7 : 1,
            }

            const className = cx({
              moving: !ammoving,
            })

            const centered = {
              textAlign : 'center',
              lineHeight: `${boxh}px`,
              fontSize: 30,
            }

            return  <div className={className} onMouseDown={this._onMouseDown.bind(this, {id:box.id, name:box.name}, w, h)} key={`${i} ${j}`} style={style}>
                        <div style={centered}>
                          {box.name}
                        </div>
                    </div> 
          });
      })

      return <div>{b}</div>
  }

  _onMouseDown(box,w,h){
     this.props.mouseDown(box,w,h);
  }
}

export default LayoutManager