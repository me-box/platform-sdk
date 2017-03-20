import React, {PropTypes, Component} from 'react';
import {connect} from 'react-redux';
import {selector} from 'features/nodes';
import {actionCreators as nodeActions} from 'features/nodes/actions';
import { bindActionCreators } from 'redux';
import NodeEditor from 'features/nodes/components/NodeEditor/';

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
            local: state[ownProps.id] //this is the local reducer provided by a node!
        }
      }, (dispatch) => {
          return{
             actions: bindActionCreators(nodeActions, dispatch),
          }
      })

      class Config extends Component {
      

        render(){
           
            const {node, id, configuringId, store, buffer, local, store:{dispatch}, nodes, links} = this.props;

            if (!node){
                return null;
            }

            const inputs = Object.keys(links).filter((key)=>{
                const link = links[key]; 
                return link.target.id === id;
            }).map((linkId)=>{

                return nodes[links[linkId].source.id];
            });
          
            const outputs = Object.keys(links).filter((key)=>{ 
               const link = links[key]; 
               return link.source.id === id;
            }).map((linkId)=>{
                return nodes[links[linkId].target.id];
            });   

            const props = {
                node,
                values:buffer,
                updateNode:  (property,value)=>{
                    this.props.actions.updateNode(property,value);
                    if (property === node._def.schemakey){
                        this.props.actions.updateSchema(id, node._def.schemafn(value));
                    }
                },
                inputs,
                outputs,
                local:local,
                dispatch,
            }

            const nodeeditorprops = {
              node,
              store,
              name: node.type,
              inputs,
              outputs,
              updateNode: this.props.actions.updateNode,
              values:buffer,
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