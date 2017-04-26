import React, { PureComponent } from 'react';
import Dialog from 'react-md/lib/Dialogs';
import TextField from 'react-md/lib/TextFields';

import {schemaLookup, defaultCode} from 'nodes/processors/uibuilder/utils';




export default class Transformer extends PureComponent {
  
  constructor(props) {
    super(props);
    this.state = {buffer:props.transformer || null}
  }
  
  closeDialog = () => {
    this.props.closeDialog();
  };

  saveDialog = () => {
    this.props.saveDialog(this.state.buffer);
  };


  renderTransformer(key, property){
    
    const defaultcode = defaultCode(key,property);

    return <TextField
              id="function"
              placeholder={defaultcode}
              block
              rows={4}
              value={this.state.buffer || defaultcode} 
              onChange={(e)=>{
                            
                                this.setState({buffer:e})
                            }
                        }
            />
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
            <strong>({from.key}:{ftype},node:Node, i:number)->{ttype}</strong>
            {this.renderTransformer(from.key, to.property)}   
          </div>
        </Dialog>
      </div>
    );
  }
}