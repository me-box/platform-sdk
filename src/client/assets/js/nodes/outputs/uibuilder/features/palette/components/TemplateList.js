import React, { Component, PropTypes } from 'react';

import TemplateItem from './TemplateItem';
import { Flex, Box } from 'reflexbox'
import SVGUpload from './SVGUpload';
import {post} from 'utils/net';

export default class TemplateList extends Component {
  
  static propTypes = {
    actions: PropTypes.object.isRequired,
    templates: PropTypes.array.isRequired
  };

  renderShapes() {
    return this.props.templates.filter((template)=>template.type!=="group").map((template) =>
      (
        <TemplateItem
          key={template.id}
          id={template.id}
          name={template.name}
          type={template.type}
          children={template.children}
          selected={this.props.selected===template.id}
          {...this.props.actions} />
      )
    );
  }

  renderGroups() {
    return this.props.templates.filter((template)=>template.type==="group").map((template) =>
      (
        <TemplateItem
          key={template.id}
          id={template.id}
          name={template.name}
          type={template.type}
          children={template.children}
          selected={this.props.selected===template.id}
          {...this.props.actions} />
      )
    );
  }

  renderSVGs(){
      return <form ref="svgUpload" encType="multipart/form-data" action="/upload/image" method="post">
                <SVGUpload style={{padding:0, width:40, height:30}}
                  id="videoFile"
                  secondary
                  accept="svg/*"
                  onChange={(f)=>{
                    const reader = new FileReader();
                    reader.onload = (output)=>{
                      //console.log(output.target.result); 
                      post("image/add", {name:f.name, image:output.target.result}).then(()=>{
                        console.log("image uploaded!!!");
                      },(err)=>{
                        console.log(err);
                      });
                    }
                    reader.readAsText(f);
                  }}
                />
              </form>
  }

  render() {
    return (
      <Flex column align="center" justify="center">
        {this.renderShapes()}
        {this.renderGroups()}
        {this.renderSVGs()}
      </Flex>
    );
  }
}
