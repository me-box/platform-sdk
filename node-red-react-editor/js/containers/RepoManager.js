import React, { Component } from 'react';
import {connect} from 'react-redux';
import Dialogue from '../components/Dialogue';
import {toggleSave} from '../actions/ToolbarActions';
import { bindActionCreators } from 'redux';
import '../../style/sass/cells.scss';

class RepoManager extends Component {
	
	constructor(props){
		super(props);
		this.toggleSave = bindActionCreators(toggleSave,props.dispatch);
	} 

	render() {
	
		const {savedialogue, dispatch} = this.props;

		const dialogueprops = {
			title: "save",
			cancel: this.toggleSave,
			ok: ()=>{console.log("ok")}
		}
		let dialogue;
		
		if (savedialogue)
		 	dialogue = 	<div id="repomanager">
							<Dialogue {...dialogueprops}>
								<div className="flexcolumncontainer">
									<div className="flexcell">
										<div className="flexrowcontainer">
											<div className="title">
												<div className="label">name</div>  
											</div>
											<div className="contentrow">
												<div className="cellcolumncontainer">
													<div className="flexcell">
														<div className="centered">
															<input type="text" placeholder="new user's surname"/>
														</div>
													</div>
												</div>           
											</div>
										</div>
									</div>
							  
							  		<div className="flexcell">
										<div className="flexrowcontainer">
											<div className="title">
												<div className="label">description</div>  
											</div>
											<div className="contentrow">
												<div className="cellcolumncontainer">
													<div className="flexcell">
														<div className="centered">
															<input type="text" placeholder="new user's surname"/>
														</div>
													</div>
												</div>           
											</div>
										</div>
									</div>
							  
							  		<div className="flexcell">
										<div className="flexrowcontainer">
											<div className="title">
												<div className="label">commit message</div>  
											</div>
											<div className="contentrow">
												<div className="cellcolumncontainer">
													<div className="flexcell">
														<div className="centered">
															<input type="text" placeholder="new user's surname"/>
														</div>
													</div>
												</div>           
											</div>
										</div>
									</div>
								</div>	
							</Dialogue>
						</div>
		return <div>{dialogue}</div>
	}
};

function select(state) {
  return {
    savedialogue: state.editor.savedialogue
  };
}

export default connect(select)(RepoManager);
