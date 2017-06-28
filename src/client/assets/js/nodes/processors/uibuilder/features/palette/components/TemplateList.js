import React, { Component, PropTypes } from 'react';

import TemplateItem from './TemplateItem';
import TemplateGroup from './TemplateGroup';
import { Flex, Box } from 'reflexbox'
import SVGUpload from './SVGUpload';
import {post} from 'utils/net';

export default class TemplateList extends Component {
  
  static propTypes = {
    actions: PropTypes.object.isRequired,
    templates: PropTypes.array.isRequired
  };

  renderShapes() {
    const {nid} = this.props;

    return this.props.templates.filter((template)=>template.type!=="group").map((template) =>
      (
        <TemplateItem
          key={template.id}
          id={template.id}
          nid={nid}
          name={template.name}
          type={template.type}
          children={template.children}
          selected={this.props.selected===template.id}
          {...this.props.actions} />
      )
    );
  }

  renderGroups() {
    const {nid} = this.props;
    return <TemplateGroup actions={this.props.actions} nid={nid} templates={this.props.templates.filter(template=>template.type==="group")}/>
  }

  renderSVGs(){
      const {nid, actions: {loadSVGTemplates}} = this.props;

      return <form ref="svgUpload" encType="multipart/form-data" action="/upload/image" method="post">
                <SVGUpload style={{padding:0, width:40, height:30, marginTop:20}}
                  id="videoFile"
                  secondary
                  accept="svg/*"
                  onChange={(f)=>{
                    const reader = new FileReader();
                    reader.onload = (output)=>{
                      //console.log(output.target.result); 
                      post("/uibuilder/image/add", {name:f.name, image:output.target.result}).then(()=>{
                          loadSVGTemplates(nid);
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
