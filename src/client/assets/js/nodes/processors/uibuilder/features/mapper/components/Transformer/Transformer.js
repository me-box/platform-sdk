import React, { PureComponent } from 'react';
//import Dialog from 'react-md/lib/Dialogs';
import Dialog from 'components/Dialogue';
import Textarea from 'components/form/Textarea';
import {schemaLookup, defaultCode} from 'nodes/processors/uibuilder/utils';
import Schema from 'features/help/components/Schema';
import { Flex, Box } from 'reflexbox'
import Birth from "../Birth";
import Death from "../Death";
import { actionCreators as mapperActions, viewConstants, selector, NAME } from '../..';
import { NAME as CANVASNAME } from 'nodes/processors/uibuilder/features/canvas/';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

@connect(selector, (dispatch) => {
  return {
      actions: bindActionCreators(mapperActions, dispatch)
  }
})
export default class Transformer extends PureComponent {
  
  constructor(props) {
    super(props);
    const template = this._currentTemplate();

    this.state = {
        showschema:false, 
        menuItem:"transformer",
        transformerBuffer: this._transformerCode(),
        birthBuffer: template ? template.enterFn|| null : null,
        deathBuffer: template ? template.exitFn || null : null,
    }

    this.transformerChange = this.transformerChange.bind(this);
    this.birthChange = this.birthChange.bind(this);
    this.deathChange = this.deathChange.bind(this);

    this.renderReturnType = this.renderReturnType.bind(this);
    this.renderFunction = this.renderFunction.bind(this);
    this.renderMenu = this.renderMenu.bind(this);
    this.renderBirth = this.renderBirth.bind(this);
    this.renderDeath = this.renderDeath.bind(this);

    this._currentTemplate = this._currentTemplate.bind(this);
    this._transformerCode = this._transformerCode.bind(this);
  }
  
  transformerChange = (id, e)=>{
    this.setState({transformerBuffer:e.target.value});
  }

  birthChange = (value)=>{
    this.setState({birthBuffer:value});
  }

  deathChange = (value)=>{
   
    this.setState({deathBuffer:value});
  }

  closeDialog = () => {
    const template = this._currentTemplate();

    this.setState({
      transformerBuffer: this._transformerCode(),
      birthBuffer: template ? template.enterFn : null,
      deathBuffer: template ? template.exitFn : null,
    });

    this.props.closeDialog();
  };

  saveDialog = () => {
    this.props.saveDialog({birth:this.state.birthBuffer, death:this.state.deathBuffer, transformer:this.state.transformerBuffer});
  };


  renderFunctionCode(key, property){
    const code = this.state.transformerBuffer === null ? defaultCode(key,property) : this.state.transformerBuffer;
    return <Textarea id="function" value={code} onChange={this.transformerChange} />
  }

  renderReturnType(ttype){
      return <div className="functionDetail">expected return type <strong>{`${ttype}`}</strong></div>
  }

  renderTypeString(key, ftype, to){
      
      const {attributes, style} = schemaLookup(to.type);
      const {showschema = false} = this.state;

      const _attributes = Object.keys(attributes).reduce((acc,key)=>{
                                  acc[key] = {
                                      name: key,
                                      type: attributes[key].type,
                                      description: attributes[key].description,
                                  }
                                  return acc;
                              },{})

      const _style = Object.keys(style).reduce((acc,key)=>{
                                  acc[key] = {
                                      name: key,
                                      type: style[key].type,
                                      description: style[key].description,
                                  }
                                  return acc;
                              },{})
     
      const extra = to.type==="group" ? {
                                            children: {
                                                name: "children", 
                                                type:"array", 
                                                description: "array of template ids of all of this groups children"
                                            }
                                        } : {};

      //plus id, label, type
      const nodeschema = {    
                              type: "object",
                              description: "svg node",
                              properties:  {
                                  ..._attributes,
                                  style: {
                                      type: "object",
                                      description: "style properties",
                                      properties: _style,
                                  },
                                  id: {name: "id",type:"string", description:"the id of the template this node was cloned from"},
                                  label: {name:"label", type:"string", description:"the label given to the template this node was cloned from"},
                                  type: {name: "type", type:"string", description: `${to.type}`},
                                  ts: {name: "ts", type:"numeric", description: "unix timestamp of when this node was first created"},
                                  ...extra

                              }
                              
                         }; 

      const types = [
          [
            {name: "key", type: "string", description: "the key that distinguishes this svg node from other svg nodes of the same type"},
            {name: key, type: ftype, description: "the datasource item being used create the transform"},
            {name: "node", type: "Node", description: "the svg node being rendered <strong>(click for schema)</strong>", onClick: ()=>{this.setState({showschema:!this.state.showschema})}}
          ],
          [
            {name: "i", type: "number", description: "an index, which increments with each new item of data"},
            {name: "w", type: "number", description: "the current width of the screen (px)"},
            {name: "h", type: "number", description: "the current height of the screen (px)"}
          ]
      ]

      const rows = types.map((col, i)=>{

          const rows = col.map((type, j)=>{
             const fn = type.onClick ? type.onClick : ()=>{};
              return  <tr onClick={fn}>
                        <td className="strong">{type.name}</td>
                        <td>{type.type}</td>
                        <td><div dangerouslySetInnerHTML={{__html:type.description}}/></td>
                      </tr>
          });
        
          return  <div key={i}>

                    <table className="table table-striped table-hover" style={{width:"100%"}}>
                      <tbody>
                        {rows}
                      </tbody>
                    </table>
                  </div>
      });

      return  <div>
                <div className="functionDetail"> arguments passed to transformer function </div>
                <div className="flexrow">
                    {rows}
                </div>
                {showschema && <div style={{maxHeight:250, overflow:"auto"}}><Schema schema={nodeschema}/></div>} 
              </div>

             
  }


  renderMenu(){
    const menuItemStyle = {
      textAlign: "center",
      borderRight: "1px solid white",  
    }

    return  <Flex align="center" style={{background:"#667793", color:"white"}}>
                <Box style={menuItemStyle} auto p={1} onClick={()=>{this.setState({menuItem:"transformer"})}}>transformer</Box>
                <Box style={menuItemStyle} auto p={1} onClick={()=>{this.setState({menuItem:"birth"})}}>birth</Box>
                <Box style={menuItemStyle} auto p={1} onClick={()=>{this.setState({menuItem:"death"})}}>death</Box>
            </Flex>
  }

  renderBirth(){
    const {[CANVASNAME]:{selected:{path}}, nid, inputs, mapping} = this.props;
    return <Birth value={this.state.birthBuffer} inputs={inputs} mapping={mapping} nid={nid} path={path} onChange={this.birthChange}/>
  }

  renderDeath(){
    const {[CANVASNAME]:{selected:{path}}, nid, inputs} = this.props;
    return <Death value={this.state.deathBuffer} inputs={inputs} nid={nid} path={path} onChange={this.deathChange}/>
  }

  renderFunction(){
    const { mapping } = this.props;
    const {from,to} = mapping || {from:null,to:null};
    let ftype = null;
    let ttype = null;

    if (from){ 
        ftype = from.type;
    }

    if (to){
  
      if (["scale", "rotate", "translate"].indexOf(to.property) !== -1){
          ttype = "transform string"
      }
      else{
        const schema = {...schemaLookup(to.type).attributes, ...schemaLookup(to.type).style}; 
        const property = schema[to.property];
        ttype = property ? property.type : null;
      }
    }

    return  <div>
              {this.renderTypeString(from.key, ftype, to)}
              {this.renderReturnType(ttype)}
              <div style={{padding:10}}>
                {this.renderFunctionCode(from.key, to.property)}    
              </div>
            </div>
  }
 
  render() {
    

    const {menuItem} = this.state;
    

    return (
      <div>
        <Dialog
          id="transformer"
          visible={this.props.selectedMapping != null}
          title="transformer"
          cancel={this.closeDialog}
          close={this.closeDialog}
          ok={this.saveDialog}>
          <div>
              {this.renderMenu()}
              {menuItem==="transformer" && this.renderFunction()}
              {menuItem==="birth" && this.renderBirth()}
              {menuItem==="death" && this.renderDeath()}
          </div>
        </Dialog>
      </div>
    );
  }

  _transformerCode(){
      const {[NAME]:{transformers}, mapping} = this.props; 

      if (mapping && mapping.mappingId){
          return transformers[mapping.mappingId] || null;
      }
      return null;
  }

  _currentTemplate(){
  
     const {[CANVASNAME]:{templatesById}, mapping} = this.props;
    
     if (mapping && mapping.to.path){
        return templatesById[mapping.to.path[mapping.to.path.length-1]]
     }
     return null;
  }
}