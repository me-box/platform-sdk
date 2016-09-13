import React, { Component } from 'react';
import {connect} from 'react-redux';
import { bindActionCreators } from 'redux';

//import Dialogue from '../components/Dialogue';
import Textfield from '../components/form/Textfield';
import Textarea from '../components/form/Textarea';
import Cell from '../components/Cell';
import Cells from '../components/Cells';

import * as RepoActions from '../actions/RepoActions';
import {fetchFlow} from '../actions/FlowActions';

//import {toggleSave} from '../actions/ToolbarActions';
import cx from 'classnames';

import '../../style/sass/cells.scss';

class RepoManager extends Component {
	
	constructor(props){
		super(props);
		Object.assign(this, ...bindActionCreators(RepoActions, props.dispatch));
		this._load = this._load.bind(this);
	} 
	
	componentDidMount(){
		const {store} = this.context;
		this.fetchFlow = bindActionCreators(fetchFlow.bind(this,store), this.props.dispatch);
		this.requestRepos();
	}

	render() {
	
		const {cansave, browsingname, showappmanager, tosave, repos, dispatch} = this.props;
		const {name, description, commit} = tosave;
		
		
		let content;
		
		
														
		const nameprops =  {	
								value: 	name,
				 				id: "name",
								onChange:(property, event)=>{
                  					this.nameChanged(event.target.value);
              					}
						}
		
		
		const browsingnameprops =  {	
								value: 	browsingname,
				 				id: "browsingname",
				 				placeholder: "user repo",
								onChange:(property, event)=>{
									console.log(event.target.value);
                  					this.browsingNameChanged(event.target.value);
              					}
							}
							
		const descriptionprops = {	
									value: 	description,
				 					id: "description",
									onChange:(property, event)=>{
                  						this.descriptionChanged(event.target.value);
              						}
								 }
			
		const commitprops = {	
									value: 	commit,
				 					id: "commit",
									onChange:(property, event)=>{
                  						this.commitChanged(event.target.value);
              						}
								 }	
		
		const nameinput = <div className="centered">
							<Textfield {...nameprops}/>												
						  </div>
		
		const usertobrowse = <div className="centered">
							<Textfield {...browsingnameprops}/>												
						  </div>
						  
		const descriptioninput 	= <Textarea {...descriptionprops}/>												
		const commitinput 		= <Textarea {...commitprops}/>				  
			
		var buttoncname = cx({
			button: true,
			selected: true,
			disabled: !cansave,
		});		
		
		//onClick={this.fetchFlow.bind(this, repo.name)}
		var saved = repos.map((repo, i)=>{
			
			return <div key={i}>
					<div className="flexrow">
						
							<div className="icon">
								<img src={repo.icon}/>
							</div>
						
						<div> 
							<div className="centered">
								{repo.name.replace("databox.", "")}
							</div>
						</div>
						<div className="submit">
						
							<div className="centered">
								<div onClick={this._load.bind(this, repo.name)} className="button selected">load</div>
							</div>
						
						</div>
					</div>
				</div>
				
		});
			//{saved}  			
		if (showappmanager)
		 	content = 	<div>
							<div className="repocontainer">									
								<Cells>
									<div>
										<div className="centered">
											save as new repo
										</div>
									</div>
									<Cell title={"name"} content={nameinput}/>
									<Cell title={"description"} content={descriptioninput}/>
									<Cell title={"commit message"} content={commitinput}/>
									<div>
										<div className="centered">
										 	<div onClick={this.savePressed} className={buttoncname}>Save</div>
										 </div>
									</div>
									<div>
										<div className="flexrow">
											<div>
												{usertobrowse}
											</div>
											<div className="submit">
						
												<div className="centered">
													<div onClick={this.browseNewUser} className="button selected">browse</div>
												</div>
						
											</div>
										</div>
									</div>
									
									{saved}
								</Cells>
							</div>
						</div>	
						
		
		return <div>
					{content}
			   </div>
	}
	
	_load(repo){
		console.log("loading " + repo);
		this.fetchFlow(repo);
	}
};

function cansave(current){
	return current && current.name != "" && current.commit != "" && current.description != "";
}

function select(state) {
  return {
    showappmanager: state.editor.appmanager,
    tosave: state.repos.tosave,
    cansave: cansave(state.repos.tosave),
    repos: state.repos.repos,
    browsingname: state.repos.browsingname,
  };
}

RepoManager.contextTypes = {
	store: React.PropTypes.object,
}


export default connect(select)(RepoManager);
