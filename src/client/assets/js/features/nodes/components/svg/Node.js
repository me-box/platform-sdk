import React, {Component} from 'react'
import {NODE_WIDTH, NODE_HEIGHT, GRID_SIZE} from 'constants/ViewConstants';
import className from 'classnames';
import Badge from './Badge';
import Button from './Button';
import Icon from './Icon';
import Inputs from './Inputs';
import Outputs from './Outputs';
import Label from './Label';
import Status from './Status'; 
import {actionCreators as nodeActions} from 'features/nodes/actions';
import {actionCreators as portActions} from 'features/ports';
import { bindActionCreators } from 'redux';
import { selector } from '../..';
import { connect } from 'react-redux';
import "./svg.scss";

@connect(selector, (dispatch) => {
  return{
     actions: {...bindActionCreators(nodeActions, dispatch), ...bindActionCreators(portActions, dispatch)},
  }
})
export default class Node extends Component {
	
	constructor(props){
		super(props);	
        this._nodeMouseDown = this._nodeMouseDown.bind(this);
        this._nodeDoubleClicked= this._nodeDoubleClicked.bind(this);
        this._nodeMouseUp = this._nodeMouseUp.bind(this);
	}

    shouldComponentUpdate(nextProps, nextState){
        return this.props.node != nextProps.node || this.props.selectedId != nextProps.selectedId;
    }

    render(){

        const {id, node, selectedId}  = this.props;
       

        const mainrectclass= className({
            node: true,
            unknown: node.type == "unknown",
            node_selected: node.id == selectedId,
            node_highlighted: node.highlighted,
        });


		const clickrectprops = {
		 	width: node.w,
        	height: node.h,
			onMouseDown: this._nodeMouseDown.bind(null,node.id),
            onMouseUp: this._nodeMouseUp.bind(null, node.id),
			fillOpacity: 0,
		}
		const clickrect =  <rect {...clickrectprops}></rect>
        
        const mainrectprops = {
            fill:  node._def.color,
            width: node.w,
        	height: node.h,
        };

		
        const mainrect =  <rect className={mainrectclass} {...mainrectprops}></rect>
        let gprops = {
            id,
            transform: `translate(${(node.x-node.w/2)},${(node.y-node.h/2)})`,
            onDoubleClick: this._nodeDoubleClicked.bind(null,node.id),
        }

        const textprops = {
            y: 35,
            x: 25,
        }
        
        let noselect = {
		  WebkitTouchCallout: 'none',
		  WebkitUserSelect: 'none',   
		  KhtmlUserSelect: 'none',   
		  MozUserSelect: 'none',   
		  MsUserSelect: 'none',       
		  userSelect: 'none',                  
		}
        
        const icontxt = node._def.unicode || '\uf040'
      
        const inputprops ={
            d: node,
            portMouseDown: this.props.actions.portMouseDown,
            portMouseOver: this.props.actions.portMouseOver,
        }

        //explictly put outputs in props so react knows to re-render if num outputs changes

        return <g {...gprops}>
                  	{mainrect}
                    <text className="icon" style={noselect} {...textprops}>{icontxt}</text>
                    {clickrect}
                    <Inputs {...inputprops}/>
                    <Outputs d={node} outputs={node.outputs}/>
                    
                </g>
        
    }

    _nodeMouseUp(id, e){
        
        e.stopPropagation();
        e.preventDefault();

        this.props.actions.nodeMouseUp(id); 
    }

    _nodeMouseDown(id){
        this.props.actions.nodeMouseDown(id);
    }
       
    _nodeDoubleClicked(id){
       this.props.actions.nodeDoubleClicked(id);
    }

}