import React, {PropTypes, Component} from 'react';
import className from 'classnames';
import { DragSource } from 'react-dnd';
//import {MOUSE_X_OFFSET,MOUSE_Y_OFFSET} from 'constants/ViewConstants';
const ItemTypes = {
  NODE: 'node'
};

const nodeSource = {

  beginDrag(props) {
    console.log("in begin drag with props");
    console.log(props);

    return {
      handleDrop: props.handleDrop
    };
  },
};

function connect(connect, monitor){
    
    return{
        connectDragSource: connect.dragSource(),
        isDragging: monitor.isDragging(),
    }
};

class Node extends Component {
	
    constructor(props){
        super(props);
        this._escapeNodeType = this._escapeNodeType.bind(this);
        this._handleClick = this._handleClick.bind(this);
        
        
        //this.exclusion = ['config','unknown','deprecated'];
        //this.core = ['subflows', 'input', 'output', 'function', 'social', 'mobile', 'storage', 'analysis', 'advanced'];
    }

    _escapeNodeType(nt) {
        return nt.replace(" ","_").replace(".","_").replace(":","_");
    }

    _handleClick(def,nt){
       
    }

    static propTypes = {
        connectDragSource: PropTypes.func.isRequired,
        isDragging: PropTypes.bool.isRequired,
        //nt: PropTypes.string.isRequired
    }

    render() {
	    const { isDragging, connectDragSource, nt, def} = this.props;
      
        const opacity = isDragging ? 0.4 : 1;
        const nodeTypeId   = this._escapeNodeType(nt);
        const category     = def.category.replace(" ","_");
        const rootCategory = category.split("-")[0];
        let label = /^(.*?)([ -]in|[ -]out)?$/.exec(nt)[1];
    
        if (typeof def.paletteLabel !== "undefined") {
            try {
                label = (typeof def.paletteLabel === "function" ? def.paletteLabel.call(def) : def.paletteLabel)||"";
            } catch(err) {
                console.log(`Definition error: ${def.name}.paletteLabel`,err);
            }
        }

        let iconContainer;

        if (def.icon) {
            let icon_url = "arrow-in.png";
            try {
                icon_url = (typeof def.icon === "function" ? def.icon.call({}) : def.icon);
            } catch(err) {
                console.log(`Definition error: ${nt}.icon`,err);
            }
            
            let iconcontainerclass = className({
                palette_icon_container : true,
                palette_icon_container_right: def.align === "right",
            });

            let iconstyle = {
                backgroundImage : `url(icons/${icon_url})`,
            }

            iconContainer = <div className={iconcontainerclass}>
                                    <div className="palette_icon" style={iconstyle}/>
                                </div>
        }

        let portOut;
        let portIn;

        if (def.outputs > 0) {
            portOut = <div className="palette_port palette_port_output"/>
        }

        if (def.inputs > 0) {
            portIn = <div className="palette_port palette_port_input"/>
        }

        const labelstyle = {
            paddingTop:10,
            paddingBottom: 20,

        }

        const container = {
            display: '-webkit-flex',
            display: 'flex',
            WebkitFlexFlow: 'column',
            flexFlow: 'column',
            textAlign: 'center',
            width: 178,
        }

        const iconstyle = {
            alignSelf: 'center',
            height: '4em',
            width: '4em',
           
            fontWeight: 'regular',
            background: def.color || '#ca2525',
            //border: '2px solid white', 
            lineHeight: '5.5em',
            textAlign: 'center',
            boxShadow: '0 3px 8px 0 rgba(0, 0, 0, 0.9), 0 6px 20px 0 rgba(0, 0, 0, 0.09)',
            color:'white',
        }


        const icon = def.icon || 'fa-bug';

        const draggable = connectDragSource( <div style={iconstyle}><i className={`fa ${icon} fa-3x fa-fw`}></i></div>);

        return              (<div style={container} onClick={this._handleClick.bind(this,def,nt)}>
                                   {draggable}
                                    <div style={labelstyle}>{label}</div>
                                </div>)
       
	}
}

export default DragSource(ItemTypes.NODE, nodeSource, connect)(Node);