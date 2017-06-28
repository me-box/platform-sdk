import React, { Component, PropTypes } from 'react';
import { Flex, Box } from 'reflexbox'
import TemplateGroupItem from './TemplateGroupItem';
import FontIcon from 'react-md/lib/FontIcons';

export default class TemplateGroup extends Component {

  constructor(props){
    super(props);
    this.state = {selected:false}
    this.toggleSelected = this.toggleSelected.bind(this);
    this.renderSVGContainer = this.renderSVGContainer.bind(this);
  }

  toggleSelected(){
    this.setState({selected: !this.state.selected});
  }

  renderSVGContainer(){
    const {nid, actions} = this.props;

    const templates = this.props.templates.map((template) =>
        (
          <TemplateGroupItem
            key={template.id}
            nid={nid}
            template={template}
            selected={this.props.selected===template.id}
            {...actions} />
        )
    );

    return (<div className="groupcontainer">
              {this.state.selected && <Flex wrap  style={{width:214}} p={1}>{templates}</Flex>}
            </div>);
  }

  render(){

    return  <div style={{zIndex:1}}>
              <div style={{textAlign:"center"}}>
                <div className="templateActions" style={{marginTop:20}}>
                  <FontIcon onClick={this.toggleSelected} style={{color:"white", fontSize:"2em"}}>picture_in_picture</FontIcon>
                </div>
              </div>
              {this.state.selected && this.renderSVGContainer()} 
            </div>
  }
}

