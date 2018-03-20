import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { actionCreators as mapperActions, viewConstants, selector, NAME } from '../..';
import { actionCreators as shapeActions, NAME as CANVASNAME } from 'nodes/processors/uibuilder/features/canvas/';
import cx from 'classnames';
import Button from 'react-md/lib/Buttons';
import {MAPPER_WIDTH} from '../../constants';
//import { actionCreators as sourceActions } from 'features/sources';

import Schema from "../Schema";
import Attributes from "../Attributes";
import Transformer from "../Transformer";
import Properties  from "../Properties";

import "./Mapper.scss";
import { Flex, Box } from 'reflexbox'
//import '../../../../../styles/index.scss';
import {schemaLookup} from 'nodes/processors/uibuilder/utils';

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

const _indentstyle = (depth)=>{
 return {
  paddingLeft: depth*7,
 }
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
      //this.state = { activeTabIndex: 0, propertiesExpanded:false, objectsExpanded:false, mapperExpanded:false, mappingsExpanded:false, birthExpanded:false, deathExpanded:false};

      this.state = {
                        attributesSelected:true, 
                        mappingsSelected: false, 
                        canvasSelected: false, 
                        treeSelected: false, 
                        selected:null,
        
                    }
      //this._handleTabChange = this._handleTabChange.bind(this);
      this._toggleSelected = this._toggleSelected.bind(this);
     

      this.renderMenu = this.renderMenu.bind(this);
      this.renderAttributes = this.renderAttributes.bind(this);
      this.renderMappings= this.renderMappings.bind(this);
      this.renderCanvas= this.renderCanvas.bind(this);
      this.renderObjects = this.renderObjects.bind(this);
      this.renderTreeNode = this.renderTreeNode.bind(this);
      this.showAttributes= this.showAttributes.bind(this)
      this.showMappings= this.showMappings.bind(this);
      this.showCanvas= this.showCanvas.bind(this);
      this.showTree= this.showTree.bind(this);
      this.renderSelectedHeading = this.renderSelectedHeading.bind(this);
      this._save = this._save.bind(this);
      this._cancel = this._cancel.bind(this);
  }

 
  renderTreeNode(template, path, selectedPath, depth){
     
      const selected = selectedPath.indexOf(template.id) != -1;
      
      const cname = cx({
        selected,
        treeNode: true,
      })

      return (<div className={cname} onClick={this._toggleSelected.bind(null, [...path, template.id], template.type, selectedPath)}>
                <div style={_indentstyle(depth)}>{`${template.label} (${template.type})`}</div>
              </div>)
  }

  renderTemplate(templateId, path, selectedPath, depth=0){
      
      const {[CANVASNAME]:{templatesById}} = this.props;
      const template = templatesById[templateId];

      return <div key={templateId}>
                  {this.renderTreeNode(template, path, selectedPath, depth)}
                  {template.type === "group" && _shouldExpand(template.id,selectedPath) && this.renderTree(template.children, [...path, template.id], selectedPath, depth+1)}
             </div>
  }

  renderTree(templates, path, selectedPath, depth=0){
      return templates.map((id)=>{
          return <div key={id}>{this.renderTemplate(id, [...path], selectedPath, depth)}</div>;
      }).reverse();
  }

  renderInputs(){

    const {inputs, nid, [NAME]:{from}} = this.props;
    const {selected} = this.state;
    
    const srcs = inputs.map((input) => {
        const name = input.name.trim() === "" ? input.label : input.name;
        const cname = cx({
          sourceName: true,
          selected: selected === input.id,
        });
        return <Box className={cname} key={input.id} onClick={()=>{this.setState({selected: input.id})}}>{name}</Box>
    });

    const schemaprops = {

        schema: inputs.reduce((acc, input)=>{
                                                return (input.id === selected) ? input.schema.output : acc;
                                            },{}),

        onSelect: this.props.actions.mapFrom.bind(null, nid, selected),

        selected: from,
    }

    const schema = selected != null ? <Schema {...schemaprops}/>: null;
  

    return <Flex flexColumn={true}>
                  <Box className="mappersrc">sources</Box>
                  {srcs}
                  {schema}
            </Flex>

  }


  renderComponents() {
    
    const {[CANVASNAME]:{templatesById, selected}, nid} = this.props;
    
    const {path=null} = selected || [];
    const id = path[path.length-1];

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
                <Box className="mapperattr">attributes</Box>
                {attrs}
                {style}
                {transforms}
            </Flex>

  }

  renderSelectedHeading(){
    const {[CANVASNAME]:{templatesById, selected:{path=null}}} = this.props; 

    if (!path || path.length <= 0)
        return null;

    const template = templatesById[path[path.length-1]];
    
    if (template){
      return <div className="mapperHeading">{template.label}</div>
    }
    return null;
  }

  renderMapper(){
      
      const headingstyle = {
        fontWeight: 'bolder',
        textAlign: 'center',
        padding: 15,
        background: '#303030',
        color: 'white',
      }

      return  <Box style={{background:'#4A4B4D'}}>
                
                <Flex>
                    <Box col={6}>{this.renderInputs()}</Box>
                    <Box col={6}>{this.renderComponents()}</Box>
                </Flex>
            </Box>
  }

  renderTransformers(){

    const {[CANVASNAME]:{templatesById}, [NAME]:{mappings}, inputs, nid} = this.props;
  
    return mappings.map((item,i)=>{
        
        const sourceName = inputs.reduce((acc,input)=>{
          if (item.from.sourceId === input.id)
            return input.name.trim() != "" ? input.name : input.label;
          return acc;
        },item.from.sourceId);

        //const [id, ...rest] = item.to.path; 

        const id = item.to.path[item.to.path.length-1];
       
        //TODO: see: https://github.com/gaearon/redux-devtools/issues/167
        //dev tools can cause old actions to be replayed when the router is replaced (but nids will be different...)
        if (!templatesById[id]){
          return null;
        }

        const templateName = templatesById[id].label;

        return <div key={i} style={{marginBottom:2, color:"white",background:"#6E7F99"}}>
                  <Flex>
                    <Box className="tfrom" mcol={10} onClick={this.props.actions.selectMapping.bind(null,nid,item)}>{`${sourceName}:`}<strong>{`${item.from.key}`}</strong></Box>
                    <Box col={2} className="tclose"><Button icon style={{color:"white"}} onClick={this.props.actions.removeMapping.bind(null,nid,item.mappingId)}>close</Button></Box>
                  </Flex>
                  <Flex>
                    <Box className="tto" col={12} onClick={this.props.actions.selectMapping.bind(null,nid,item)}> {`${templateName}:`}<strong>{`${item.to.property}`}</strong></Box>  
                  </Flex>
                </div>
    })
   
  }


  renderProperties(){
      const { activeTabIndex } = this.state;
      const {[CANVASNAME]:{templatesById, selected:{path}}, nid} = this.props; 
      const template = templatesById[path[path.length-1]]
      return <Properties template={template} updateAttribute={this.props.actions.updateTemplateAttribute.bind(null,nid,path)} updateStyle={this.props.actions.updateTemplateStyle.bind(null,nid,path)}/>
  }

  renderAttributes(){
      const { activeTabIndex } = this.state;
      const {[CANVASNAME]:{templatesById, selected:{path}}, nid} = this.props; 
      const template = templatesById[path[path.length-1]]
     
      return <Properties template={template} updateAttribute={this.props.actions.updateTemplateAttribute.bind(null,nid,path)} updateStyle={this.props.actions.updateTemplateStyle.bind(null,nid,path)}/>
          
  }

  renderMappings(){
    

    return  <div>
              <div>
                {this.renderMapper()}    
              </div>
              <div style={{background:"#4A4B4D", padding:3, marginTop:3}}>
                <div className="transformerHeading">transformers</div>
                {this.renderTransformers()}
              </div>
            </div>
  }

  renderCanvas(){
    return <Flex align="center" justify="center">
              <Box auto p={1}>canvas</Box> 
            </Flex>
  }


  
  renderObjects(){
      const {[CANVASNAME]:{selected, templates}, nid} = this.props;
      const {path=null} = selected || [];
      const tree = this.renderTree(templates, [], path);
    
      const layerstyle = {
        fontFamily:"FontAwesome",
        textAlign: "center",
        color: "white",
      }
      return <div>
              
              <Flex align="center" style={{background:"#5C5C5C", color:"white"}}>
                <Box auto p={1} style={layerstyle} onClick={()=>this.props.actions.moveUp(nid)}><i className="fa fa-arrow-up"></i></Box>
                <Box auto p={1} style={layerstyle} onClick={()=>this.props.actions.moveDown(nid)}><i className="fa fa-arrow-down"></i></Box>
              </Flex>
              <Flex flexColumn={true} style={{maxHeight: 200, overflow:'auto'}}>
                <Box> 
                  {tree}
                </Box>
              </Flex>
            </div>
  }

  renderMenu(){

    return <Flex align="center" style={{background:"#5C5C5C", color:"#fff"}}>
              <Box auto p={1} onClick={this.showAttributes} style={{textAlign:'center', background: this.state.attributesSelected ? "#4A4B4D" : "none" , fontWeight: this.state.attributesSelected ? 'bold' : 'normal'}}> attributes </Box>
              <Box auto p={1} onClick={this.showMappings}   style={{textAlign:'center', background: this.state.mappingsSelected ? "#4A4B4D" : "none", fontWeight: this.state.mappingsSelected ? 'bold' : 'normal'}}> mappings </Box>   
            </Flex>
  }
  
  showAttributes(){
    this.setState({canvasSelected:false, mappingsSelected:false, attributesSelected:true, treeSelected:false});
  }

  showMappings(){
    this.setState({canvasSelected:false, mappingsSelected:true, attributesSelected:false, treeSelected:false});
  }

  showCanvas(){
    this.setState({canvasSelected:true, mappingsSelected:false, attributesSelected:false, treeSelected:false});
  }

  showTree(){
    this.setState({canvasSelected:false, mappingsSelected:false, attributesSelected:false, treeSelected:true});
  }

  render() {
   
    const {[NAME]:{open, selectedMapping, transformers}, [CANVASNAME]:{selected}, h, nid, inputs} = this.props;
    const {attributesSelected, mappingsSelected, canvasSelected, treeSelected} = this.state;

    if (!selected)
        return null;

    const mapperstyle = {
        position: "absolute",
        height: h,
        right: 0,
        background: "#5C5C5C",
        opacity: 0.95,
        overflow:'auto',
        width: MAPPER_WIDTH,
        padding: 3,

    }

    return <div id="mapper">
              <div style={mapperstyle}>
                
                  {this.renderObjects()}
                  <Flex flexColumn={true}>
                    {this.renderSelectedHeading()}
                    <div style={{padding: 3}}>
                      {this.renderMenu()}
                      {attributesSelected && this.renderAttributes()}
                      {mappingsSelected && this.renderMappings()}
                      {canvasSelected && this.renderCanvas()}
                    </div>
                  </Flex>
              </div>
              {selectedMapping && <Transformer 
                                      nid={nid} 
                                      inputs={inputs}
                                      mapping={selectedMapping} 
                                      saveDialog={this._save} 
                                      closeDialog={this._cancel}/>}     
            </div>    
  }

  _save(buffer){
      const {[NAME]:{selectedMapping}, nid} = this.props;
       
      
      //this.props.actions.updateTemplateAttribute(nid, selectedMapping.to.path, "enterFn", buffer.birth || null);
      //this.props.actions.updateTemplateAttribute(nid, selectedMapping.to.path, "exitFn", buffer.death || null);
      
      this.props.actions.mapBirth(nid, selectedMapping.mappingId, buffer.birth || null);
      this.props.actions.mapDeath(nid, selectedMapping.mappingId, buffer.death || null);

      if (buffer.transformer){
          this.props.actions.saveTransformer(nid, selectedMapping.mappingId, buffer.transformer);
      }
      this.props.actions.selectMapping(nid,null);
  }

  _cancel(){
    this.props.actions.selectMapping(this.props.nid,null);
  }


  _handleTabChange(activeTabIndex) {
      this.setState({ activeTabIndex });
  }

  _toggleSelected(path,type,selectedPath){
      const {nid} = this.props;
     
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