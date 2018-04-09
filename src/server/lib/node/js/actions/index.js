const NODE_UPDATE_VALUE       = 'iot.red/nodes/NODE_UPDATE_VALUE';
const NODE_UPDATE_SCHEMA      = 'iot.red/nodes/NODE_UPDATE_SCHEMA';
const NODE_UPDATE_DESCRIPTION = 'iot.red/nodes/NODE_UPDATE_DESCRIPTION';
const NODE_CONFIGURE_OK       = 'iot.red/nodes/NODE_CONFIGURE_OK';
const NODE_CONFIGURE_CANCEL   = 'iot.red/nodes/NODE_CONFIGURE_CANCEL';

const _leaf= (id, links)=>{
  const item = links.find((item)=>{
    return item.split(":")[1] === id;
  });
  return item ? false : true;
}

const _remove_loops=(links)=>{
  return links.reduce((acc, item)=>{
    if (!(acc.find(i=>_from(i) === _to(item) && _to(i) === _from(item)))){
      acc = [...acc, item];
    }
    return acc;
  },[]);
}

const _children=(id, links)=>{
  if (_leaf(id,links)){
    return [id];
  }
  return [id, ...links.filter((l)=>_from(l) === id).map(link=>[].concat(..._children(_to(link), links)))];
}

const _from =(link)=>{
  return link.split(":")[1]
} 

const _to =(link)=>{
  return link.split(":")[2]
}

const _downstreamnodes =(id, links)=>{
  return [].concat(..._children(id, _remove_loops(links))).filter(i=>i !== id);
}

const _updatedownstream = (id, dispatch, getState)=>{
 
  const links = getState().ports["links"];
  const downstream = _downstreamnodes(id,links);

  downstream.forEach((n)=>{

    const nodes = getState().nodes.nodesById;
    const node = nodes[n];


    const inputs = links.filter((key)=>{
            return _to(key) === n;
        }).map((linkId)=>{
          const {id, schema} = nodes[_from(linkId)];
          return {id,schema};
        });

    if (node){ 
      
      const value = node._def.schemakey ? node[node._def.schemakey] : null;

      dispatch({
        type: 'iot.red/nodes/NODE_UPDATE_SCHEMA',
        id: n,
        schema: node._def.schemafn(value, node.id, inputs || [])
      });
    }
    else{
      dispatch({
        type: 'iot.red/nodes/NODE_UPDATE_SCHEMA',
        id: n,
        schema: {},
      });
    }
  });
}

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

function updateDownStream(id){
  return (dispatch, getState)=>{
    _updatedownstream(id, dispatch, getState);
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
    schema
  }
}

export const actionCreators = {
  updateNode,
  updateSchema,
  updateDescription,
  updateDownStream,
  nodeConfigureOk,
  nodeConfigureCancel,
}