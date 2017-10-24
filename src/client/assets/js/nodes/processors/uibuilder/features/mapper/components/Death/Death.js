import React, { PureComponent } from 'react';
import { Flex, Box } from 'reflexbox'
import Schema from 'features/help/components/Schema';
import { actionCreators as templateActions } from 'nodes/processors/uibuilder/features/canvas/';
import { selector } from '../..';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import {resolvePath} from 'nodes/processors/uibuilder/utils';
import Textarea from 'components/form/Textarea';
import Textfield from 'components/form/Textfield';
import Button from 'react-md/lib/Buttons/Button';
import {schemaLookup} from 'nodes/processors/uibuilder/utils';

const _wraplookup = (key,sourcepath,fnstr)=>{
    const _path = JSON.stringify(sourcepath); 
    return `const lookup=(data)=>${_path}.reduce((acc,item)=>{return acc[item]},data)["${key}"]; ${fnstr}`; 
}

@connect(selector, (dispatch) => {
  return {
      actions: bindActionCreators(templateActions, dispatch)
  }
})

export default class Death extends PureComponent {
  
 constructor(props) {
    super(props);
    this.state = {showschema:false}; 
    this.renderTypeString = this.renderTypeString.bind(this);
 }


 renderTypeString(){

      const {template} = this.props;
      const {attributes, style} = schemaLookup(template.type);
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
     
      const extra = template.type==="group" ? {
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
              type: {name: "type", type:"string", description: `${template.type}`},
              ts: {name: "ts", type:"numeric", description: "unix timestamp of when this node was first created"},
              ...extra

          }
          
      }

      const types = [
          [
            {name: "data", type: "object", description: "the source data"},
            {name: "node", type: "Node", description: "the svg node being rendered <strong>(click for schema)</strong>", onClick: ()=>{this.setState({showschema:!this.state.showschema})}},
            {name: "index", type: "number", description: "an index, which increments with each new item of data"}
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
                <div className="functionDetail"> arguments passed to death function </div>
                <div className="flexrow">
                    {rows}
                </div>
                {showschema && <div style={{maxHeight:250, overflow:"auto"}}><Schema schema={nodeschema}/></div>} 
              </div>
    
    return <div>typestring</div>         
  }


 render() {
   
   const deathcode = this.props.value === null ? "return false" : this.props.value.body || null;

   return    <div>
                    {this.renderTypeString()}
                     <div style={{padding:10}}>
                        <Textarea
                          id="exitfunction"
                          value={deathcode}
                          onChange={(id, e)=>{
                              this.props.onChange({params:["data","index","node"], body:e.target.value})
                          }}
                        />
                      </div>
                </div>
 }

}