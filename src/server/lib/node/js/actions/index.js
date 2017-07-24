const NODE_UPDATE_VALUE       = 'iot.red/nodes/NODE_UPDATE_VALUE';
const NODE_UPDATE_SCHEMA      = 'iot.red/nodes/NODE_UPDATE_SCHEMA';
const NODE_UPDATE_DESCRIPTION = 'iot.red/nodes/NODE_UPDATE_DESCRIPTION';
const NODE_CONFIGURE_OK       = 'iot.red/nodes/NODE_CONFIGURE_OK';
const NODE_CONFIGURE_CANCEL   = 'iot.red/nodes/NODE_CONFIGURE_CANCEL';

function nodeConfigureOk(){
    return {
      type: NODE_CONFIGURE_OK,
    }
} 

function nodeConfigureCancel(){
    return {
      type: NODE_CONFIGURE_CANCEL,
    }
}

function updateNode(property, value){
  return {
    type: NODE_UPDATE_VALUE,
    property,
    value,
  }
}

function updateDescription(id, description){
  return {
    type: NODE_UPDATE_DESCRIPTION,
    id,
    description,
  }
}

function updateSchema(id, schema){
  return {
    type: NODE_UPDATE_SCHEMA,
    id,
    schema,
  }
}

export const actionCreators = {
  updateNode,
  updateSchema,
  updateDescription,
  nodeConfigureOk,
  nodeConfigureCancel,
}