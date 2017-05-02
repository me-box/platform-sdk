import React, { Component, PropTypes } from 'react';
import classnames from 'classnames';
import { Flex, Box } from 'reflexbox'
import { DragSource } from 'react-dnd';
import FontIcon from 'react-md/lib/FontIcons';
import {generateIds} from '../../../utils';

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
      template: props.type,
      children: generateIds(props.children),
    };
  },

};

const iconForType = (type)=>{
    

    switch(type){

      case "circle":
        return "radio_button_unchecked"
      
      case "ellipse":
        return "vignette"

      case "rect":
        return "check_box_outline_blank"

      case "line":
        return "border_color"

      case "path":
        return  "gesture"

      case "group":
        return "picture_in_picture"

      case "text":
        return "text_format"

      default:
        return "warning"
    
    }
}

class TemplateItem extends Component {
  static propTypes = {
    selectTemplate: PropTypes.func.isRequired,
    id: PropTypes.number.isRequired,
    selected: PropTypes.bool.isRequired,
    type: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired,
    connectDragSource: PropTypes.func.isRequired,
    isDragging: PropTypes.bool.isRequired,
  };

  render() {
   
    const { isDragging, connectDragSource, name, type } = this.props;
    console.log(isDragging);

    const draggable = connectDragSource( <div style={{paddingTop:20}} onClick={() => this.props.selectTemplate(this.props.nid, this.props.id)}><FontIcon style={{color:"white", fontSize:"2em"}}>{iconForType(type)}</FontIcon></div>)
    
    return  <div style={{textAlign:"center"}}>
              <div className="templateActions">
                  {draggable}
              </div>
            </div>
    
  }
}

export default DragSource(ItemTypes.TEMPLATE, templateSource, connect)(TemplateItem);