import React, { Component } from 'react';
import {connect} from 'react-redux';
import { bindActionCreators } from 'redux';
import {init} from '../comms/websocket';
import config from '../config';

class TestManager extends Component {
	
	constructor(props){
		super(props);
	} 
	
	componentDidMount(){
		const {dispatch, id} = this.props;
		init("databox",id, dispatch);
	}

	render() {
		
		//eventually we need to do a check on all nodes with _def.category = outputs
		//but for now we only support debug and app 
		const {nodes} = this.props;
		const typesOfInterest = ["debugger", "app"];
		
		const iconstyle = {
            alignSelf: 'center',
            height: '4em',
            width: '4em',
            fontWeight: 'regular',
            background: '#d45500',
            border: '2px solid white', 
            lineHeight: '5.5em',
            textAlign: 'center',
            boxShadow: '0 3px 8px 0 rgba(0, 0, 0, 0.9), 0 6px 20px 0 rgba(0, 0, 0, 0.09)',
            color:'white',
        }
		
		
		
		const seen = {};
		const links = nodes.reduce((acc, node)=>{
			if (!seen[node.type] && typesOfInterest.indexOf(node.type) != -1){
				acc.push(node);
				seen[node.type]=true;
			}
			return acc;
		},[]).map((node)=>{
			return <div>
						<div className="flexrow">
							<div>
								<div style={{margin:'auto', padding: 20}}>
									<div>
										<a href={`${config.testurl}/#/${node.type}`} target="_blank">
											<div style={iconstyle}>
												<i className={`fa ${node._def.icon} fa-fw fa-3x`}></i> 
											</div>
										</a>
									</div>
								</div>
							</div>
						</div>
				   </div>
			
		});
		
		const messagestyle ={
			color: '#333',
			padding: 10,
		}
		
		let message = ""
		if (links.length == 0){
			message = "This flow does not have any outputs that can be viewed in test mode, currently the only supported outputs for testing are debug and app";
		}
		if (links.length == 1){
			message = "This flow has one output that can be viewed in test mode.  Click on it to take a look";
		}else{
			message = `This flow has ${links.length} flows with outputs that can be viewed in test mode.  Click on any one to take a look`; 
		}
		
		return <div className="flexcolumn">
					<div style={messagestyle}>
						<div className="flexrow">
							<div className="centered" >
								{message}
							</div>
						</div>
					</div>
					{links}
				</div>
	}
	
};

function select(state) {
  return {
     nodes: state.nodes.nodes,
  }
}

export default connect(select)(TestManager);
