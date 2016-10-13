import React from 'react';
import composeNode from '../../../utils/composeNode';
import Textfield from '../../../components/form/Textfield';
import LayoutManager from './LayoutManager';
import {reducer} from './reducer';
import { bindActionCreators } from 'redux';
import * as LayoutActions from './actions';
import { bindNodeIds } from '../../../utils/utils';
import {LAYOUT_HEIGHT} from './ViewConstants';

function _haveinput(id, inputs){
	for (let i = 0; i < inputs.length; i++){
		if (inputs[i].id === id){
			return true;
		}
	}
	return false;
}

function _havelayout(id, layout){
	for (let i = 0; i < layout.length; i++){
		for (let j = 0; j < layout[i].length; j++){
			if (layout[i][j] === id)
				return true;
		}
	}
	return false;
}

function _findnewinputs(inputs, layout){
	return inputs.filter((input)=>{
		return !_havelayout(input.id, layout);
	}).map((input)=>{
		return input.id;
	});
}

function _findnameforbox(id, inputs){
	
	if (!inputs)
		return id;
	
	for (let i = 0; i < inputs.length; i++){
		if (inputs[i].id === id){
			return inputs[i].name && inputs[i].name.trim() != "" ? inputs[i].name : id; 		
		}
	}
	return id;
}

/* 
 * pull in current layout and add any new inputs / remove old inputs.
 */
 
function _convertlayout(layout, inputs){
	if (!layout){
		return null;
	}
	//remove any items in the layout that are not inputs!
	
	const removed = layout.reduce((acc, row)=>{
		const newrow = row.reduce((acc, box)=>{
			if (_haveinput(box, inputs)){
				acc.push(box);
			}
			return acc;
		},[]);	
		if (newrow.length > 0){
			acc.push(newrow);
		}
		return acc;
	},[]);
	
	const newinputs = _findnewinputs(inputs, removed);

	
	//just add them to a new row.
	if (newinputs.length > 0){
		removed.push(newinputs);
	}
	
	
	return removed.map((row)=>{
	  	return row.map((box)=>{
	  		return {name: _findnameforbox(box, inputs), id: box}
	  	});
	});
}

function _convertinputs(inputs){
	 return [inputs.map((input)=>{return {id: input.id, name: input.name && input.name.trim() != "" ? input.name: input.id}})];
}

class Node extends React.Component {
		
	  constructor(props){
	    	
	  	 super(props);
	  	 const id = props.selected.id; 
	  	 Object.assign(  this, 
              ...bindActionCreators(bindNodeIds(LayoutActions, id), props.dispatch), 
         );
	  	 this._onMouseMove = this._onMouseMove.bind(this);
	  }
	  
	  componentDidMount(){
	  	const boxes = _convertlayout(this.props.selected.layout, this.props.inputs) || _convertinputs(this.props.inputs);
		this.initLayout(boxes);
	  }
      
      render() {
		const NAMEROWHEIGHT = 190;
		const WIDTH = this.props.width;
		const HEIGHT = LAYOUT_HEIGHT;
         
        //local is the stuff in this node's reducer
		const {local, selected, inputs, values, updateNode} = this.props;
    
        const nameprops = {

              id: "name",
             
              value: values.name || "",
             
              onChange: (property, event)=>{
                  updateNode(property, event.target.value);
              },
             
              selected: selected,
        }
          
        const fixedheight = {
          	height: HEIGHT - NAMEROWHEIGHT,
          	//overflow: 'hidden',
        }
          
        const layoutprops = {
          	w: WIDTH,
          	h: HEIGHT-NAMEROWHEIGHT,
          	mouseDown: this.mouseDown,
          	local: local, 
        }
          
        const mouseprops = {
       		onMouseMove: this._onMouseMove,
       		onMouseUp: this.mouseUp,
       		onDragEnd: this.onDragEnd,
    	}

    	const mousestyle = {
    		position: 'absolute',
    		top: NAMEROWHEIGHT,
       		width: '100%',
       		height: HEIGHT - NAMEROWHEIGHT,
       		overflow: 'hidden',
    	}
        
        return 	<div className="flexcolumn">
          				<div>
          					<div className="flexrow">
								<div className="title">	
									<div className="centered">app name</div>
								</div>
					
								<div>
									<div className="centered">
										<Textfield {...nameprops}/>
									</div>
								</div>
							</div>
						</div>
						<div>
							<div className="flexrow" style={fixedheight}>
								<div>
									<div {...mouseprops} style={mousestyle}>
										<LayoutManager {...layoutprops}/>
									</div>
								</div>
							</div>
						</div>
					</div>						 
       }
       
		_onMouseMove(e){
    		const {clientX, clientY} = e;
    		this.mouseMove(clientX,clientY);
  		}
}

export default composeNode(Node, 'app', 
                            {
                                category: 'outputs',      
                                color: '#d45500',
                                defaults: {             
                                    name: {value:""},
                                    appId: {value:"webapp"},
                                    layout: {value: null},
                                },
                                inputs:1,               
                                outputs:0,             
                               
                                icon: "fa-mobile", 
                                unicode: '\uf10b',       
                                label: function() {     
                                    return this.name||this.topic||"databox app";
                                },
                                
                                schema: ()=>{
                                
                                	const _descriptions = [
                                								{type: "gauge", schema: {options:{title:'atitle', ticks: 'number of ticks'}, values: {id:'auniqueid', type:'data', dataid:'auniqueid', x:'avalue'}}}, 
                                						   		{type: "bar",   schema: {options:{title:'atitle', ticks: 'number of ticks'}, values: {id:'auniqueid', type:'data', dataid:'auniqueid', x:'xvalue', y:'yvalue'}}}, 
                                						   		{type: "text",  schema: {values: 'sometext'}}, 
                                						   		{type: "list",  schema: {values: {timestamp: 'a timestamp', keys:['key1','key2', '..'], values:{key1:'key1value', key2:'key2value'}}}},
                                	];
                                	 
                                	 
                                	const subschema = _descriptions.map((item)=>{
                                		return `<div><div class=\"flexrow\"><div class=\"title\"><div class=\"centered\">${item.type}</div></div><div><div class=\"centered\">${JSON.stringify(item.schema)}</div></div></div></div>`
                                	}).join("");
                                	
                                	return {
                                			input:{
                                				sourceId: {type:'string',  description: '<i>[selectedid]</i>'},
												type: {type:'string', description: "one of either \'text\', \'gauge\', \'bar\' or \'list\'"},
                                				payload: {
                                							type: 'object', 
                                							description: 'the message payload', 
                                							schema: {
                                										values: {	
                                													type:'any', 
                                									 				description: `<div class=\"flexcolumn\"><div><div class=\"centered\">dependent on the type of msg (msg.type)</div></div>${subschema}</div>`
                                									 			}
                                									 }, 
                                				},
												
                                			}
                                	}
                                },
                                
                                description: ()=> "<p>This component is used to send a display to the databox UI for this app. It can render text, bar and gauge charts (...more soon...)</p>", 

                                labelStyle: function() { 
                                    return this.name?"node_label_italic":"";
                                }
                            }, reducer
                          );