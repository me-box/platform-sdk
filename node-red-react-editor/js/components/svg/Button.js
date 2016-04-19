import React, { Component, PropTypes } from 'react';
import className from 'classnames';
import {NODE_HEIGHT} from '../../constants/ViewConstants';

export default class Button extends Component {
  
        constructor(props){
                super(props);
                this._buttonMouseUp = this._buttonMouseUp.bind(this);
                this._buttonMouseDown = this._buttonMouseDown.bind(this);
                this._buttonMouseOver = this._buttonMouseOver.bind(this);
                this._buttonMouseOut = this._buttonMouseOut.bind(this);
                this._buttonMouseClick = this._buttonMouseClick.bind(this);
        }

        _buttonMouseUp(d,e){
                
        }

        _buttonMouseDown(d,e){
                /*if (!lasso && !d.changed) {
                        focusView();
                        d3.select(this).attr("fill-opacity",0.2);
                        d3.event.preventDefault(); 
                        d3.event.stopPropagation();
                }*/
        }

        _buttonMouseOver(d,e){
                /*
                        d3.select(this).attr("fill-opacity",0.4);
                        d3.event.preventDefault();
                        d3.event.stopPropagation();
                }*/
        }

        _buttonMouseOut(d,e){
                /*if (!lasso  && !d.changed) {
                    var op = 1;
                    if (d._def.button.toggle) {
                        op = d[d._def.button.toggle]?1:0.2;
                    }
                    d3.select(this).attr("fill-opacity",op);
        }*/
        }

        _buttonMouseClick(d,e){
                /*if (!activeSubflow && !d.changed) {
            if (d._def.button.toggle) {
                d[d._def.button.toggle] = !d[d._def.button.toggle];
                d.dirty = true;
            }
            if (d._def.button.onclick) {
                try {
                    d._def.button.onclick.call(d);
                } catch(err) {
                    console.log("Definition error: "+d.type+".onclick",err);
                }
            }
            if (d.dirty) {
                redraw();
            }
        } else if (d.changed) {
            RED.notify(RED._("notification.warning", {message:RED._("notification.warnings.undeployedChanges")}),"warning");
        } else {
            RED.notify(RED._("notification.warning", {message:RED._("notification.warnings.nodeActionDisabled")}),"warning");
        }
        d3.event.preventDefault();*/
        }

        render(){
                const {d} = this.props;

                
                if (!d._def.button){   
                    return null;
                }

                const buttonClassName = className({
                    node_button: true,
                    node_right_button: d._def.align === "right",
                    node_left_button: d._def.align != "right",
                });
                        
                const transX = d._def.align === "right" ? 94 : -25;

                const buttonprops = {
                        transform: `translate(${transX},2)`
                }

                const r1props = {
                        rx:5,
                        ry:5,
                        width:32,
                        height:NODE_HEIGHT-4,
                        fill:'#eee',
                }

                const r2props = {
                        x: d._def.align=="right" ? 11: 5,
                        y: 4,
                        rx: 4,
                        ry: 4,
                        width: 16,
                        height: NODE_HEIGHT-12,
                        fill: d._def.color,
                        cursor: 'pointer',
                        onMouseUp: this._buttonMouseUp.bind(this,d),
                        onMouseDown: this._buttonMouseDown.bind(this,d),
                        onMouseOver: this._buttonMouseOver.bind(this,d),
                        onMouseOut: this._buttonMouseOut.bind(this,d),
                        onClick: this._buttonMouseClick.bind(this, d),
                        onTouchStart: this._buttonMouseClick.bind(this,d),
                }

                return  (<g className={buttonClassName} {...buttonprops}>
                                <rect {...r1props} />
                                <rect className="node_button_button" {...r2props} />
                        </g>);        
        }       
}

