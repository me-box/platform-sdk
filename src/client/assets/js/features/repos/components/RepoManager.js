import React, { Component } from 'react';
import {connect} from 'react-redux';
import { bindActionCreators } from 'redux';

import Textfield from 'components/form/Textfield';
import Textarea from 'components/form/Textarea';
import Cell from 'components/Cell';
import Cells from 'components/Cells';
import Dialogue from 'components/Dialogue';
import Drawer from 'react-md/lib/Drawers';
import Toolbar from 'react-md/lib/Toolbars';
import Button from 'react-md/lib/Buttons';
import Avatar from 'react-md/lib/Avatars';
import ListItem from 'react-md/lib/Lists/ListItem';
import List from 'react-md/lib/Lists/List';
import FontIcon from 'react-md/lib/FontIcons';
//import {toggleSave} from '../actions/ToolbarActions';

import cx from 'classnames';
import {actionCreators as repoActions} from '../actions';
import {NAME as repoName, selector} from 'features/repos';
import {NAME as editorName, actionCreators as editorActions} from 'features/editor';
import {contextTypes} from 'utils/ReactDecorators';
import {TOOLBAR_HEIGHT} from 'constants/ViewConstants';

const saveable = (current)=>{
	return current && current.name != "" && current.commit != "" && current.description != "";
}

const LoadIcon = () => <FontIcon>cloud_download</FontIcon>;


@connect(selector, (dispatch) => {
  return{
     actions: bindActionCreators(repoActions, dispatch),
  }
})
@contextTypes({ store: React.PropTypes.object })
export default class RepoManager extends Component {
	
	constructor(props){
		super(props);
		this._load = this._load.bind(this);
	} 
	
	renderDialogue(){

		const {repos: {loaded, browsingname, tosave: {name, description, commit}, savedialogue}} = this.props;
		const {nameChanged, browsingNameChanged, descriptionChanged, commitChanged, savePressed, commitPressed, toggleSaveDialogue} = this.props.actions;
		
		if (savedialogue){

			const nameprops =  {	
									value: 	name,
					 				id: "name",
									onChange:(property, event)=>{
	                  					nameChanged(event.target.value);
	              					}
							}
			
			
			const browsingnameprops =  {	
									value: 	browsingname,
					 				id: "browsingname",
					 				placeholder: "user repo",
									onChange:(property, event)=>{
										console.log(event.target.value);
	                  					browsingNameChanged(event.target.value);
	              					}
								}
								
			const descriptionprops = {	
										value: 	description,
					 					id: "description",
										onChange:(property, event)=>{
	                  						descriptionChanged(event.target.value);
	              						}
									 }
				
			const commitprops = {	
										value: 	commit,
					 					id: "commit",
										onChange:(property, event)=>{
	                  						commitChanged(event.target.value);
	              						}
									 }	
			
			const nameinput = <div className="centered">
								<Textfield {...nameprops}/>												
							  </div>
		
		    const descriptioninput 	= <Textarea {...descriptionprops}/>												
			const commitinput 		= <Textarea {...commitprops}/>		

			let dialogueprops, dialoguecontent;

			
			if (!loaded || (!loaded.sha.flows && !loaded.sha.manifest)){
				
			    dialogueprops = {
					cancel: toggleSaveDialogue,
					ok: ()=>{savePressed(); toggleSaveDialogue()},
					title: "create new repo",
    			}
    	
				dialoguecontent = <Cells>
										<div>
											<div className="centered">
												save as new repo
											</div>
										</div>
										<Cell title={"name"} content={nameinput}/>
										<Cell title={"description"} content={descriptioninput}/>
										<Cell title={"commit message"} content={commitinput}/>
								  </Cells>
			}else{
			
				dialogueprops = {
					cancel: toggleSaveDialogue,
					ok: ()=>{commitPressed(); toggleSaveDialogue()},
					title: "save update",
    			}
    			
				dialoguecontent = <Cells>
										<div>
											<div className="centered">
												save
											</div>
										</div>
										<Cell title={"commit message"} content={commitinput}/>
									</Cells>
			}	
		
	
			return <Dialogue {...dialogueprops}>
						{dialoguecontent}
					</Dialogue>
    	}

    	return null;

	}


	componentDidMount(){
		this.props.actions.requestRepos();
	}

	render(){
		const {repos:{repos, visible}} = this.props;
		const close = <Button icon onClick={this.props.actions.toggleVisible}>close</Button>;
		let dialogue = null;

		const _repos = repos.map((repo)=>{

			const avatar = <Avatar src={repo.icon}  role="presentation" />

			return <ListItem onClick={this._load.bind(null, repo.name)} key={repo.name}
				        leftAvatar={avatar}
				        rightIcon={<LoadIcon />}
				        primaryText={repo.name.replace("databox.", "")}
				        secondaryText="repo description"
				      />
					
		});

		const header = (
      		<Toolbar
      			colored
      			title={`your repos`}
        		actions={close}
        		className="md-divider-border md-divider-border--bottom"
        		style={{background:"#303030"}}
      		/>
    	);

		


		return  <div>
					<Drawer 
							position="right" 
							header={header}
							visible={visible}
							onVisibilityToggle={()=>{}}
				           >
				            <div style={{height: `calc(100vh - ${TOOLBAR_HEIGHT}px)`, overflowY:'auto'}}>
				            <List style={{width:"100%"}}>
	          					{_repos}
	          				</List>
	          				</div>
	        		</Drawer>
	        		{this.renderDialogue()}
	        	</div>
	}

	_load(repo){
		this.props.actions.fetchFlow(this.context.store, repo);
	}
}



/*

/*render() {
		const showappmanager = false;
		const showsavedialogue = false;

		const {repos:{browsingname, tosave, repos, current}} = this.props;
		
		const cansave = saveable(tosave);

		const {name, description, commit} = tosave;
		

		
		let loader;
		
		
														
		const nameprops =  {	
								value: 	name,
				 				id: "name",
								onChange:(property, event)=>{
                  					this.props.actions.nameChanged(event.target.value);
              					}
						}
		
		
		const browsingnameprops =  {	
								value: 	browsingname,
				 				id: "browsingname",
				 				placeholder: "user repo",
								onChange:(property, event)=>{
									console.log(event.target.value);
                  					this.props.actions.browsingNameChanged(event.target.value);
              					}
							}
							
		const descriptionprops = {	
									value: 	description,
				 					id: "description",
									onChange:(property, event)=>{
                  						this.props.actions.descriptionChanged(event.target.value);
              						}
								 }
			
		const commitprops = {	
									value: 	commit,
				 					id: "commit",
									onChange:(property, event)=>{
                  						this.props.actions.commitChanged(event.target.value);
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
		
		const close = {
			display: 'flex',
			flexDirection: 'row',
			margin: '5px 10px 20px 0px',
			WebkitFlexDirection: 'row',
   			flexDirection: 'row',
   			WebkitJustifyContent:  'flex-end',
 		 	justifyContent: 'flex-end',
		}
			//{saved}  			
		if (showappmanager){
		 	loader = 	<div className="repocontainer" style={{padding:7}}>									
							<Cells>
								<div>
									<div className="flexrow">
										<div>
											{usertobrowse}
										</div>
										<div className="submit">
		
											<div className="centered">
												<div onClick={this.props.actions.browseNewUser} className="button selected">browse</div>
											</div>
		
										</div>
									</div>
								</div>
					
								{saved}
							</Cells>
						</div>
									
		 }			
						
		let dialogue, dialoguecontent, dialogueprops;
    
    	if (showsavedialogue){
    		
    	
			if (!current || (!current.sha.flows && !current.sha.manifest)){
				
			    dialogueprops = {
					cancel: this.props.actions.toggleSaveDialogue,
					ok: ()=>{this.savePressed(); this.props.actions.toggleSaveDialogue()},
					title: "create new repo",
    			}
    	
				dialoguecontent = <Cells>
										<div>
											<div className="centered">
												save as new repo
											</div>
										</div>
										<Cell title={"name"} content={nameinput}/>
										<Cell title={"description"} content={descriptioninput}/>
										<Cell title={"commit message"} content={commitinput}/>
								  </Cells>
			}else{
			
				dialogueprops = {
					cancel: this.toggleSaveDialogue,
					ok: ()=>{this.commitPressed(); this.props.actions.toggleSaveDialogue()},
					title: "save update",
    			}
    			
				dialoguecontent = <Cells>
										<div>
											<div className="centered">
												save
											</div>
										</div>
										<Cell title={"commit message"} content={commitinput}/>
									</Cells>
			}	
		
	
			dialogue = <Dialogue {...dialogueprops}>
						 {dialoguecontent}
						</Dialogue>
    	}
    
		return 	<div>
					{dialogue}
					{loader}
				</div>
	}
	
	_load(repo){
		this.props.actions.fetchFlow(repo);
	}
};

function cansave(current){
	return current && current.name != "" && current.commit != "" && current.description != "";
}

function select(state) {
  return {
    //showappmanager: state.editor.appmanager,
    tosave: state.repos.tosave,
    cansave: cansave(state.repos.tosave),
    repos: state.repos.repos,
    current: state.repos.loaded,
    browsingname: state.repos.browsingname,
    //showsavedialogue: state.editor.savedialogue,
  };
}

RepoManager.contextTypes = {
	store: React.PropTypes.object,
}*/

