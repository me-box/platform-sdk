import React from 'react';
import Dialogue from '../components/Dialogue';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import * as RegisterActions from '../actions/RegisterActions';
import {nodeCancelClicked} from '../actions/NodeMouseActions';
export default function composeNode2(Component, nt, config){

	class Node extends React.Component{
		
		constructor(props){
			super(props);
			Object.assign(  this, 
              ...bindActionCreators(RegisterActions, props.dispatch), 
              {nodeCancelClicked: bindActionCreators(nodeCancelClicked, props.dispatch)}
           );
		}

	
		componentDidMount(){
          this.registerType(nt, config);
       	}
		

		render(){

			const {selected, dispatch} = this.props;
    
           const dialogueprops = {
              cancel: this.nodeCancelClicked,
              nt: nt,
              node: selected,
           }
           
           const componentprops = {
              register: this.props.register, 
              dispatch: dispatch,
           }
          
           if (selected && selected.type === nt){
				return <Dialogue>
						<Component {...this.props} />
					</Dialogue>
			}
			return null;
		}
	}

	function select(state) {
      return {
        selected: state.nodes.selected,
      //and need some details here!
    	}
    }

	return connect(select)(Node)
}