import React, { PureComponent } from 'react';
//import Dialog from 'react-md/lib/Dialogs';
import Dialog from 'components/Dialogue';
import Textarea from 'components/form/Textarea';
import {schemaLookup, defaultCode} from 'nodes/processors/uibuilder/utils';
import Schema from 'features/help/components/Schema';

export default class Transformer extends PureComponent {
  
  constructor(props) {
    super(props);
    this.state = {buffer:props.transformer || null, showschema:false}
    this.codeChange = this.codeChange.bind(this);
     this.renderReturnType = this.renderReturnType.bind(this);
  }
  

  codeChange = (id, e)=>{
    this.setState({buffer:e.target.value});
  };

  closeDialog = () => {
    this.props.closeDialog();
  };

  saveDialog = () => {
    this.props.saveDialog(this.state.buffer);
  };


  renderFunction(key, property){
    const defaultcode = defaultCode(key,property);
    return <Textarea id="function" value={this.state.buffer || defaultcode} onChange={this.codeChange} />
    
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


                         /*style: schemaLookup(to.type).style,
                                id: {type:"string", descriptipn:"the id of the template this node was cloned from"},
                                label: {type:"string", description:"the label given to the template this node was cloned from"},
                                type: {type:"string", description: `${to.type}`},*/

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

 
  render() {
    const { selectedMapping } = this.props;

   
    console.log("in transformer with selected Mapping", selectedMapping);


    const {from,to} = selectedMapping || {from:null,to:null};
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
               {this.renderTypeString(from.key, ftype, to)}
               {this.renderReturnType(ttype)}
               <div style={{padding:10}}>
                  {this.renderFunction(from.key, to.property)}   
                  
                </div>
          </div>
        </Dialog>
      </div>
    );
  }
}