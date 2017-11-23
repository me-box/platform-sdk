import {connect} from 'react-redux';
import {actionCreators as nodeActions} from './actions';
import { bindActionCreators } from 'redux';
import NodeEditor from './components/NodeEditor/';
import {NODE_EDITOR_PADDING, TAB_HEIGHT, PALETTE_WIDTH, TOOLBAR_HEIGHT, WORKSPACE_FOOTER} from './constants/ViewConstants';



export function contextTypes(cType) {
    return function (DecoratedComponent) {
        DecoratedComponent.contextTypes = cType;
        return DecoratedComponent;
    }
}

export function configNode(){  
  
  return function (DecoratedComponent){

      return @connect((state,ownProps)=>{

         return{
            nodes: state.nodes.nodesById,
            links: state.ports.linksById,
            selectedId: state.nodes.selectedId,
            configuringId: state.nodes.configuringId,
            node: state.nodes.nodesById[ownProps.id],
            buffer: state.nodes.buffer,
            local: state[ownProps.id],
            w: state.editor.screen.w,
            h: state.editor.screen.h,  //this is the local reducer provided by a node!
        }
      }, (dispatch) => {
          return{
             actions: bindActionCreators(nodeActions, dispatch),
          }
      })

      class Config extends React.Component {
         
        render(){
           
            const {node, id, configuringId, store, buffer, local, store:{dispatch}, nodes, links, w, h} = this.props;

            if (!node){
                return null;
            }

            const NODE_EDITOR_WIDTH       = w - ((2* NODE_EDITOR_PADDING) + PALETTE_WIDTH);
            const NODE_EDITOR_MAX_HEIGHT  = h - (2 * NODE_EDITOR_PADDING);

            const inputs = Object.keys(links).filter((key)=>{
              const link = links[key]; 
              return link.target.id === id;
            }).map((linkId)=>{
              const {name, label, id, schema, subtype, type, _def:{color,icon,category}} = nodes[links[linkId].source.id];
              return {name,label,id,schema,type, subtype, color,icon,category};
            });
          
            const outputs = Object.keys(links).filter((key)=>{ 
              const link = links[key]; 
              return link.source.id === id;
            }).map((linkId)=>{
              const {name, label, id, schema, subtype, type, _def:{color,icon,category}} = nodes[links[linkId].target.id];
              return {name,label,id,schema,type, subtype, color,icon,category};
            });   //get _def out

            const props = {
                node,
                values:buffer,
                updateNode:  (property,value)=>{
                    this.props.actions.updateNode(property,value);
                    if (property === node._def.schemakey){
                        this.props.actions.updateSchema(id, node._def.schemafn(value));
                        this.props.actions.updateDescription(id, node._def.descriptionfn(value));
                    }
                },
                inputs,
                outputs,
                local:local,
                dispatch,
                store,
                w,
                h,
                contenth: h - (TOOLBAR_HEIGHT + TAB_HEIGHT + TOOLBAR_HEIGHT +  (2 * NODE_EDITOR_PADDING) + WORKSPACE_FOOTER  + 40),
                contentw: NODE_EDITOR_WIDTH,
            }

            const nodeeditorprops = {
              node,
              store,
              name: node.type,
              inputs,
              outputs,
              updateNode: this.props.actions.updateNode,
              values:buffer,
              w,
              h,
            }

            if (node.id && node.id === configuringId){
                return <NodeEditor {...nodeeditorprops}>
                          <DecoratedComponent {...props}/>
                       </NodeEditor>
            }
            return null;
        }
      }
   }
}