import React, { PureComponent } from 'react';
import Dialog from 'react-md/lib/Dialogs';
import Textarea from 'components/form/Textarea';
import {schemaLookup, defaultCode} from 'nodes/processors/uibuilder/utils';




export default class Transformer extends PureComponent {
  
  constructor(props) {
    super(props);
    this.state = {buffer:props.transformer || null}
    this.codeChange = this.codeChange.bind(this);
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


  renderTransformer(key, property){
    
    const defaultcode = defaultCode(key,property);

    
    return <Textarea id="function" value={this.state.buffer || defaultcode} onChange={this.codeChange} />
    /*return <TextField rows={4}/>

             id="function"
              placeholder={defaultcode}
              block
              rows={4}
              value={this.state.buffer || defaultcode} 
              onChange={(e)=>{
                            
                                this.setState({buffer:e})
                            }
                        }
            />*/
  }

 
  render() {
    const { selectedMapping } = this.props;

  
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
          title="Transformer"
          onHide={this.closeDialog}
          aria-labelledby="transformerDescription"
          modal
          actions={[{
            onClick: this.saveDialog,
            primary: true,
            label: 'done',
          }, {
            onClick: this.closeDialog,
            primary: true,
            label: 'cancel',
          }]}
        >
          <div>
            <strong>(id:string,{from.key}:{ftype},node:Node, i:number, w:number, h:number)->{ttype}</strong>
            {this.renderTransformer(from.key, to.property)}   
          </div>
        </Dialog>
      </div>
    );
  }
}