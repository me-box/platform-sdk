import React, { Component, PropTypes } from 'react';
import classnames from 'classnames';
import { Flex, Box } from 'reflexbox'
import { DragSource } from 'react-dnd';
import FontIcon from 'react-md/lib/FontIcons';
import {generateIds} from '../../../utils';
import {camelise,calculateBounds} from 'nodes/processors/uibuilder/utils';

function connect(connect, monitor){
    
    return{
        connectDragSource: connect.dragSource(),
        isDragging: monitor.isDragging(),
    }
};

const ItemTypes = {
  TEMPLATE: 'template'
};

const templateSource = {

  beginDrag(props) {
    return {
      template: props.template.type,
      children: generateIds(props.template.children),
    };
  },

};

class TemplateGroupItem extends Component {

  constructor(props){
    super(props);
    this.renderTemplate = this.renderTemplate.bind(this);
    this.renderGroup = this.renderGroup.bind(this);
    this.renderChildren = this.renderChildren.bind(this);
  }

  static propTypes = {
    selectTemplate: PropTypes.func.isRequired,
    selected: PropTypes.bool.isRequired,
    connectDragSource: PropTypes.func.isRequired,
    isDragging: PropTypes.bool.isRequired,
  };

  renderTemplate(){
    
    const {template}= this.props;
    const bounds = calculateBounds(template.children);
    const {width=50, height=50} = bounds;

    return <svg width={50} height={50} viewBox={`0,0,${width},${height}`}>
              {this.renderGroup(template)}
            </svg>
  }


  renderGroup(template){
      return <g key={template.id}>
              {this.renderChildren(template.children)}
            </g>
  }

  renderCircle(template){
    const {id,cx,cy,r,style} = template;
    const _style = camelise(style);
    return <circle key={id} cx={template.cx} cy={template.cy} r={template.r} style={_style}/>
  }

  renderEllipse(template){
    const {id,cx,cy,rx,ry,style} = template;
    const _style = camelise(style);
    return <ellipse key={id} cx={cx} cy={cy} rx={rx} ry={ry} style={_style}/>
  }

  renderText(template){
    const {id, x,y,text,style} = template;
    const _style = camelise(style);
    return <text key={id} textAnchor="middle" x={x} y={y} style={_style}>{text}</text>
  }

  renderRect(template){
    const {id,x,y,rx,ry,width,height,style,transform="translate(0,0)"} = template;
    const _style = camelise(style);
    return <rect key={id} rx={rx} ry={ry} x={x} y={y} width={width} height={height} style={_style}/>
  }

  renderLine(template){
    const {id,x1,x2,y1,y2,style} = template;
    const _style = camelise(style);
    return <line key={id} x1={x1} x2={x2} y1={y1} y2={y2} style={_style}/>
  }

  renderPath(template){
    const {id, d,style} = template;
    const _style = camelise(style);
    return <path key={id} d={d} style={_style} />
  }

  renderChildren(children){
    
    return Object.keys(children).map((id)=>{

      const template = children[id];

      switch(template.type){
        
       case "circle":
          return this.renderCircle(template);

        case "ellipse":
          return this.renderEllipse(template);

        case "text":
          return this.renderText(template);

        case "rect":
          return this.renderRect(template);
        
        case "line":
          return this.renderLine(template);

        case "path":
          return this.renderPath(template);

        case "group":
          return this.renderGroup(template);

        default:
          return null;
      }

    });
}

  render() {
   
    const { isDragging, connectDragSource, template, nid} = this.props;
    const draggable = connectDragSource( <div onClick={() => this.props.selectTemplate(nid, template.id)}>{this.renderTemplate()}</div>)
    
    return  <Box px={1} style={{textAlign:"center"}}>
              <div style={{background:'white'}} className="templateActions">
                  {draggable}
              </div>
            </Box>
    
  }
}

export default DragSource(ItemTypes.TEMPLATE, templateSource, connect)(TemplateGroupItem);