import React, { Component } from 'react';
import CSSTransitionGroup from 'react-addons-css-transition-group';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { actionCreators as mapperActions, viewConstants, selector, NAME } from '../..';
import { actionCreators as shapeActions, NAME as CANVASNAME } from 'nodes/processors/uibuilder/features/canvas/';
//import { actionCreators as sourceActions } from 'features/sources';

import Schema from "../Schema";
import Attributes from "../Attributes";
import Transformer from "../Transformer";
import Properties  from "../Properties";
import Birth from "../Birth";
import Death from "../Death";

import "./Mapper.scss";
import { Flex, Box } from 'reflexbox'
//import '../../../../../styles/index.scss';
import {schemaLookup} from 'nodes/processors/uibuilder/utils';
import Paper from 'react-md/lib/Papers';


import Card from 'react-md/lib/Cards/Card';
import CardTitle from 'react-md/lib/Cards/CardTitle';
import CardActions from 'react-md/lib/Cards/CardActions';
import CardText from 'react-md/lib/Cards/CardText';


const sourceName = (sources, sourceId)=>{
  for (source in sources){
      if (sourceId === source.id){
          return source.name;
      }
  }
  return sourceId;
}

const templateName = (templates, templateId)=>{
  for (template in templates){
    if (template.id === templateId){
      return template.label;
    }      
  }
  return templateId;
}

const _shouldExpand = (path, selectedPath)=>{
    
    if (!selectedPath){
      return false;
    }
    return selectedPath.indexOf(path) != -1;
}

@connect(selector, (dispatch) => {
  return {
  		actions: {
        ...bindActionCreators(mapperActions, dispatch), 
        //...bindActionCreators(sourceActions, dispatch), 
        ...bindActionCreators(shapeActions, dispatch)
      }
	}
})

export default class Mapper extends Component {
  
  
  constructor(props){
      super(props);
      this.state = { activeTabIndex: 0, propertiesExpanded:false, objectsExpanded:false, mapperExpanded:false, mappingsExpanded:false, birthExpanded:false, deathExpanded:false};
      this._handleTabChange = this._handleTabChange.bind(this);
      this._toggleSelected = this._toggleSelected.bind(this);
      this.state = {selected: null};
  }


  renderInputs(){
    const {inputs, nid} = this.props;
    const {selected} = this.state;
    
    const srcs = inputs.map((input) => {
        const name = input.name.trim() === "" ? input.label : input.name;
        return <Box key={input.id} onClick={()=>{this.setState({selected: input.id})}}>{name}</Box>
    });

    const schema = selected != null ? <Schema {
                                                ...{
                                                      schema: inputs.reduce((acc, input)=>{return (input.id === selected) ? input.schema.output : acc;},{}),
                                                      onSelect: this.props.actions.mapFrom.bind(null, nid, selected) 
                                                    }
                                              }
                                    />: null;
    
    return <Flex flexColumn={true}>
                  {srcs}
                  {schema}
            </Flex>

  }

  renderTemplate(templateId, path, selectedPath){
      
      const {[CANVASNAME]:{templatesById}} = this.props;
      const template = templatesById[templateId];

      return <div key={templateId}>
                  <li onClick={this._toggleSelected.bind(null, [...path, template.id], template.type, selectedPath)}>
                      {`${template.label} (${template.type})`}
                  </li>
                  {template.type === "group" && _shouldExpand(template.id,selectedPath) && this.renderTree(template.children, [...path, template.id], selectedPath)}
             </div>
  }

  renderTree(templates, path, selectedPath){
      return templates.map((id)=>{
          return <ul key={id}>{this.renderTemplate(id, [...path], selectedPath)}</ul>;
      });
  }

  renderObjects(){
      const {[CANVASNAME]:{selected, templates}} = this.props;
      const {path=null} = selected || [];
      const tree = this.renderTree(templates, [], path);
      return <Flex flexColumn={true}>
              <Box> 
                {tree}
              </Box>
            </Flex>
  }

  renderComponents() {
    
    const {[CANVASNAME]:{templatesById, selected}, nid} = this.props;
    
    const {path=null} = selected || [];
    const [id, ...rest] = path;


    const template = id ? templatesById[id] : null;
   

    const attrs = id != null ? <Attributes {
                                                      ...{
                                                            attributes: Object.keys(schemaLookup(template.type).attributes), 
                                                            onSelect: this.props.actions.mapToAttribute.bind(null, nid, path)
                                                          }
                                                  }
                                      /> : null;
    
    const style = id != null ? <Attributes {
                                                      ...{
                                                            attributes:  Object.keys(schemaLookup(template.type).style), 
                                                            onSelect: this.props.actions.mapToStyle.bind(null,nid,path)
                                                          }
                                                  }
                                      /> : null;

    const transforms = id != null ? <Attributes {
                                                          ...{
                                                              attributes: ["rotate", "scale", "translate"],
                                                              onSelect: this.props.actions.mapToTransform.bind(null,nid,path)
                                                          }
                                                      }
                                      /> : null;
    return  <Flex flexColumn={true}>
                {attrs}
                {style}
                {transforms}
            </Flex>

  }


  renderMapper(){
      const {[CANVASNAME]:{templatesById, selected:{path=null}}} = this.props; 

      if (!path || path.lnegth <= 0)
        return null;

      const template = templatesById[path[path.length-1]]

      return  <Box>
                <div style={{paddingBottom:7, fontWeight:"bold"}}>{template.label}</div>
                <Flex>
                    <Box col={6}>{this.renderInputs()}</Box>
                    <Box col={6}>{this.renderComponents()}</Box>
                </Flex>
            </Box>
  }

  renderMappings(){

    const {[CANVASNAME]:{templatesById}, [NAME]:{mappings}, inputs, nid} = this.props;
  
    return mappings.map((item,i)=>{
        
        const sourceName = inputs.reduce((acc,input)=>{
          if (item.from.sourceId === input.id)
            return input.name.trim() != "" ? input.name : input.label;
          return acc;
        },item.from.sourceId);

        const [id, ...rest] = item.to.path; 
        const templateName = templatesById[id].label;

        return <Flex key={i}>
                    <Box col={11} onClick={this.props.actions.selectMapping.bind(null,nid,item)} >{`${sourceName}:${item.from.key}`}->{`${templateName}:${item.to.property}`}</Box>
                    <Box col={1} onClick={this.props.actions.removeMapping.bind(null,nid,item.mappingId)}><strong>x</strong></Box>
                </Flex>
    })
   
  }

  renderBirthOptions(){
    const {[CANVASNAME]:{selected:{path}}, nid, inputs} = this.props;
    return <Birth inputs={inputs} nid={nid} path={path}/>
  }

  renderDeathOptions(){
     const {[CANVASNAME]:{selected:{path}}, nid, inputs} = this.props;
     return <Death inputs={inputs} nid={nid} path={path}/>
  }


  shouldComponentUpdate(nextProps, nextState){

     //first check to see if nothing has been selected, in which case only re-render if mapping has changed
     if (!this.props[CANVASNAME].selected && !nextProps[CANVASNAME].selected){
         console.log(`updating: ${this.props[NAME] !== nextProps[NAME]}`)
         return  this.props[NAME] !== nextProps[NAME] 
     }
     //otherwise check to see if previously selected template != current selected template
     else if (this.props[CANVASNAME].selected !== nextProps[CANVASNAME].selected){
        return true;
     }
     else{
        const {[CANVASNAME]:{selected:{path}}} = this.props;
        const tId = path[path.length-1];
        return this.props[CANVASNAME].templatesById[tId] !=  nextProps[CANVASNAME].templatesById[tId] || this.props[NAME] !== nextProps[NAME]     
     }
  }

  renderProperties(){
      const { activeTabIndex } = this.state;
      const {[CANVASNAME]:{templatesById, selected:{path}}, nid} = this.props; 
      const template = templatesById[path[path.length-1]]
      return <Properties template={template} updateAttribute={this.props.actions.updateTemplateAttribute.bind(null,nid,path)} updateStyle={this.props.actions.updateTemplateStyle.bind(null,nid,path)}/>
  }

  render() {
   
    const {[NAME]:{open, selectedMapping, transformers}, [CANVASNAME]:{selected}, h, nid} = this.props;
    const {propertiesExpanded, objectsExpanded, mappingsExpanded, mapperExpanded, birthExpanded, deathExpanded} = this.state;

    if (!selected)
        return null;
      
    return (
              <div id="mapper" style={{width:viewConstants.MAPPER_WIDTH, boxSizing:'border-box', height: h, overflow:'auto'}}>
                 <Paper key={1} zDepth={1}>
                    <Card className="md-block-centered"  expanded={objectsExpanded} onExpanderClick={()=>{this.setState({objectsExpanded:!objectsExpanded})}}>
                        <CardActions expander onClick={()=>{this.setState({objectsExpanded:!objectsExpanded})}}>
                          objects
                        </CardActions>
                        <CardText style={{padding:0}}  expandable>
                          {this.renderObjects()}
                        </CardText>
                    </Card>
                    {selected && <Card className="md-block-centered" defaultExpanded onExpanderClick={()=>{this.setState({propertiesExpanded:!propertiesExpanded})}}>
                        <CardActions expander onClick={()=>{this.setState({propertiesExpanded:!propertiesExpanded})}}>
                          properties
                        </CardActions>
                        <CardText style={{padding:0}} expandable>
                          {this.renderProperties()}
                        </CardText>
                    </Card>}
                    {selected &&  <Card className="md-block-centered" expanded={birthExpanded} onExpanderClick={()=>{this.setState({birthExpanded:!birthExpanded})}}>
                        <CardActions expander onClick={()=>{this.setState({birthExpanded:!birthExpanded})}}>
                            birth
                        </CardActions>
                        <CardText expandable>
                          {this.renderBirthOptions()}
                        </CardText>
                    </Card>}
                    {selected && <Card className="md-block-centered" expanded={deathExpanded} onExpanderClick={()=>{this.setState({deathExpanded:!deathExpanded})}}>
                        <CardActions expander onClick={()=>{this.setState({deathExpanded:!deathExpanded})}}>
                          death
                        </CardActions>
                        <CardText expandable>
                           {this.renderDeathOptions()}
                        </CardText>
                    </Card>}
                    {selected && <Card className="md-block-centered" expanded={mapperExpanded} onExpanderClick={()=>{this.setState({mapperExpanded:!mapperExpanded})}}>
                        <CardActions expander onClick={()=>{this.setState({mapperExpanded:!mapperExpanded})}}>
                          behaviour
                        </CardActions>
                        <CardText expandable>
                          {this.renderMapper()}
                          {this.renderMappings()}
                          {selectedMapping && <Transformer selectedMapping={selectedMapping} transformer={transformers[selectedMapping.mappingId]} saveDialog={this.props.actions.saveTransformer.bind(null, nid, selectedMapping.mappingId)} closeDialog={this.props.actions.selectMapping.bind(null,nid,null)}/>}
                        </CardText>
                    </Card>}
                  </Paper>
              </div>
           );
  }


   _handleTabChange(activeTabIndex) {
      this.setState({ activeTabIndex });
   }

   _toggleSelected(path,type,selectedPath){
      const {nid} = this.props;
      //toogle here by checking laste elements of each path;
      if (selectedPath != null && path.length > 0 && type==="group"){
          const id1 = selectedPath[selectedPath.length-1];
          const id2 = path[path.length-1];
          if (id1 === id2){
            this.props.actions.templateParentSelected(nid);
            return;
          }
      }
      this.props.actions.templateSelected(nid, {path:path, type:type});
      
   }
}