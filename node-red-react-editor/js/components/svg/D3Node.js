import React, {Component} from 'react'
import {NODE_WIDTH, NODE_HEIGHT, GRID_SIZE} from '../../constants/ViewConstants';
import {calculateTextWidth} from '../../utils/utils';
import className from 'classnames';
import Badge from './Badge';
import Button from './Button';
import Icon from './Icon';
import Inputs from './Inputs';
import Outputs from './Outputs';

class D3Node extends Component {
	
	constructor(props){
		super(props);	
		this._nodeMouseUp =	this._nodeMouseUp.bind(this);
		this._nodeMouseDown = this._nodeMouseDown.bind(this);
		this._nodeTouchStart = this._nodeTouchStart.bind(this);
		this._nodeTouchEnd = this._nodeTouchEnd.bind(this);
		this._nodeMouseOver = this._nodeMouseOver.bind(this);
		this._nodeMouseOut = this._nodeMouseOut.bind(this);
	}

	_nodeMouseUp(d,e){
		/*if (dblClickPrimed && mousedown_node == d && clickElapsed > 0 && clickElapsed < 750) {
            mouse_mode = RED.state.DEFAULT;
            if (d.type != "subflow") {
                RED.editor.edit(d);
            } else {
                RED.editor.editSubflow(activeSubflow);
            }
            clickElapsed = 0;
            d3.event.stopPropagation();
            return;
        }
        var direction = d._def? (d.inputs > 0 ? 1: 0) : (d.direction == "in" ? 0: 1)
        portMouseUp(d, direction, 0);*/
	}
	
	_nodeMouseDown(d,e){
		/*
		focusView();
    
        if (mouse_mode == RED.state.IMPORT_DRAGGING) {
            RED.keyboard.remove(27);

            if (activeSpliceLink) {
                // TODO: DRY - droppable/nodeMouseDown/canvasMouseUp
                var spliceLink = d3.select(activeSpliceLink).data()[0];
                RED.nodes.removeLink(spliceLink);
                var link1 = {
                    source:spliceLink.source,
                    sourcePort:spliceLink.sourcePort,
                    target: moving_set[0].n
                };
                var link2 = {
                    source:moving_set[0].n,
                    sourcePort:0,
                    target: spliceLink.target
                };
                RED.nodes.addLink(link1);
                RED.nodes.addLink(link2);
                var historyEvent = RED.history.peek();
                historyEvent.links = [link1,link2];
                historyEvent.removedLinks = [spliceLink];
                updateActiveNodes();
            }

            updateSelection();
            RED.nodes.dirty(true);
            redraw();
            resetMouseVars();
            d3.event.stopPropagation();
            return;
        }
        mousedown_node = d;
        var now = Date.now();
        clickElapsed = now-clickTime;
        clickTime = now;

        dblClickPrimed = (lastClickNode == mousedown_node);
        lastClickNode = mousedown_node;

        var i;

        if (d.selected && (d3.event.ctrlKey||d3.event.metaKey)) {
            mousedown_node.selected = false;
            for (i=0;i<moving_set.length;i+=1) {
                if (moving_set[i].n === mousedown_node) {
                    moving_set.splice(i,1);
                    break;
                }
            }
        } else {
            if (d3.event.shiftKey) {
                clearSelection();
                var cnodes = RED.nodes.getAllFlowNodes(mousedown_node);
                for (var n=0;n<cnodes.length;n++) {
                    cnodes[n].selected = true;
                    cnodes[n].dirty = true;
                    moving_set.push({n:cnodes[n]});
                }
            } else if (!d.selected) {
                if (!d3.event.ctrlKey && !d3.event.metaKey) {
                    clearSelection();
                }
                mousedown_node.selected = true;
                moving_set.push({n:mousedown_node});
            }
            selected_link = null;
            if (d3.event.button != 2) {
                mouse_mode = RED.state.MOVING;
                var mouse = d3.touches(this)[0]||d3.mouse(this);
                mouse[0] += d.x-d.w/2;
                mouse[1] += d.y-d.h/2;
                for (i=0;i<moving_set.length;i++) {
                    moving_set[i].ox = moving_set[i].n.x;
                    moving_set[i].oy = moving_set[i].n.y;
                    moving_set[i].dx = moving_set[i].n.x-mouse[0];
                    moving_set[i].dy = moving_set[i].n.y-mouse[1];
                }
                mouse_offset = d3.mouse(document.body);
                if (isNaN(mouse_offset[0])) {
                    mouse_offset = d3.touches(document.body)[0];
                }
            }
        }
        d.dirty = true;
        updateSelection();
        redraw();
        d3.event.stopPropagation();*/
	}
	
	_nodeTouchStart(d,e){
		/*var obj = d3.select(this);
        var touch0 = d3.event.touches.item(0);
        var pos = [touch0.pageX,touch0.pageY];
        startTouchCenter = [touch0.pageX,touch0.pageY];
        startTouchDistance = 0;
        touchStartTime = setTimeout(function() {
            showTouchMenu(obj,pos);
        },touchLongPressTimeout);
        nodeMouseDown.call(this,d)*/
	}
	
	_nodeTouchEnd(d,e){
		/*clearTimeout(touchStartTime);
        touchStartTime = null;
        if  (RED.touch.radialMenu.active()) {
            d3.event.stopPropagation();
            return;
        }
        nodeMouseUp.call(this,d);*/
	}
	
	_nodeMouseOver(d,e){
		/*if (mouse_mode === 0) {
                                    var node = d3.select(this);
                                    node.classed("node_hovered",true);
                                }*/
	}

	_nodeMouseOut(d,e){
 		/*var node = d3.select(this);
        node.classed("node_hovered",false);*/
	}

	render(){
		let d = Object.assign({},this.props);

		let l = d._def.label;
        try {
            l = (typeof l === "function" ? l.call(d) : l)||"";
        } catch(err) {
            console.log("Definition error: "+d.type+".label",err);
            l = d.type;
        }
        
        
        d.w = Math.max(NODE_WIDTH,GRID_SIZE*(Math.ceil((calculateTextWidth(l, "node_label", 50)+(d._def.inputs>0?7:0))/GRID_SIZE)) );
        d.h = Math.max(NODE_HEIGHT,(d.outputs||0) * 15);
            
        let badge, button, mainrect, icon, label, status, statuserrorimage, statuschangedimage, inputs, outputs;

        if (d._def.badge) {
        	badge = <Badge d={d}/>
        }

        if (d._def.button) {
        	button = <Button d={d}/>
		}

        if (d._def.icon){
            icon = <Icon d={d}/>
        }

        if (d._def.inputs){
            inputs = <Inputs d={d} />
        }

        if (d._def.outputs){
            outputs = <Outputs d={d} />
        }

		const mainrectclass= className({
			node: true,
			unknown: d.type == "unknown",
            node_selected: d.selected,
            node_highlighted: d.highlighted,
		});

		const mainrectprops = {
			rx: 5,
			ry: 5,
			fill:  d._def.color,
            width: d.w,
            height: d.h,
			onMouseUp: this._nodeMouseUp.bind(this,d),
			onMouseDown: this._nodeMouseDown.bind(this,d),
			onTouchStart: this._nodeTouchStart.bind(this,d),
			onTouchEnd:this._nodeTouchEnd.bind(this,d),
			onMouseOver: this._nodeMouseOver.bind(this,d),
			onMouseOut: this._nodeMouseOut.bind(this,d),
		};

		mainrect = 	<rect className={mainrectclass} {...mainrectprops}></rect>
              
        const nodelabelclassname ={
            node_label: true,
            node_label_right: d._def.align && d._def.align == "right", 
            node_label_left: d._def.align && d._def.align == "left", 
        }

        if (d._def.labelStyle){
            try{
                let s = (typeof d._def.labelStyle === "function") ? d._def.labelStyle.call(d) :  d._def.labelStyle || "";
                nodelabelclassname[s] = true;
            }catch (err){
                console.log(`Definition error: ${d.type}.labelStyle`,err);
            }
        }
        

        const nodelabelprops = {
            x: d._def.align && d.def.align === "right" ? d.w-38 : 38,
            y: (d.h/2)-1,
            dy: ".35em",
            textAnchor: d._def.align ? d._def.align === "right" ? 'end' : 'start' : 'start',
        }


        let labeltext = d._def.label ? d._def.label : "";

        try {
            labeltext = (typeof labeltext === "function" ? labeltext.call(d) : l) || labeltext;
        } catch(err) {
            console.log(`Definition error: ${d.type}.label`,err);
            l = d.type;
        }


        label = <text className={nodelabelclassname} {...nodelabelprops}> 
                    {labeltext}
                </text>

        const statusrectprops = {
            x: 6,
            y: 1,
            width: 9,
            height: 9,
            rx: 2,
            ry: 2,
            strokeWidth: 3,
        }

        const statuslabelprops = {
            x: 20,
            y: 9,
        }

        status = <g className="node_status_group" style={{display:'none'}}> 
                            <rect {...statusrectprops}/>
                            <text {...statuslabelprops}/>
                      </g>


        const statuserrorimageprops = {
            xlinkHref: "icons/node-error.png",
            x: 0,
            y: -6,
            width: 10,
            height: 9,
        }

        statuserrorimage = <image className="node_error hidden" {...statuserrorimageprops}/>


        const statuschangedimageprops = {
            xlinkHref: "icons/node-changed.png",
            x: 12,
            y: -6,
            width: 10,
            height: 10,
        }

        statuschangedimage = <image className="node_changed hidden" {...statuserrorimageprops}/>


		let gprops = {
			id: this.props.id,
            transform: `translate(${(d.x-d.w/2)},${(d.y-d.h/2)})`,
		}

		return <g {...gprops}>
					{badge}
					{button}
					{mainrect}
                    {icon}
                    {label}
                    {status}
                    {statuserrorimage}
                    {statuschangedimage}
                    {inputs}
                    {outputs}
				</g>
	}
}

export default D3Node;