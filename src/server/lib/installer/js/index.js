
const LOAD_NODE =  'iot.red/nodetypes/LOAD_NODE';

export function install(node){
    const store = storelib.get();
    console.log("ok stire is", store);

    const {dispatch} = store;
    console.log("diaptch us", dispatch);
    
    dispatch({
      type: LOAD_NODE,
      node,
    });
}