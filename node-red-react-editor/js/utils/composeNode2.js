import React from 'react';
import Dialogue from '../components/Dialogue';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import * as RegisterActions from '../actions/RegisterActions';
import {nodeCancelClicked} from '../actions/NodeMouseActions';
export default function composeNode2(Component, nt){

	class Node extends React.Component{
		
		constructor(props){
			super(props);
			Object.assign(  this, 
              ...bindActionCreators(RegisterActions, props.dispatch), 
              {nodeCancelClicked: bindActionCreators(nodeCancelClicked, props.dispatch)}
           );
		}

	
		componentDidMount(){
          this.registerType('sentiment', {
                  category: 'analysis-function',
                  color:"#E6E0F8",
                  defaults: {
                      name: {value:""},
                  },
                  inputs:1,
                  outputs:1,
                  icon: "arrow-in.png",
                  label: function() {
                      return this.name||"sentiment";
                  },
                  labelStyle: function() {
                      return this.name?"node_label_italic":"";
                  }
           });
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
          
           if (selected && selected.type === 'sentiment'){
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