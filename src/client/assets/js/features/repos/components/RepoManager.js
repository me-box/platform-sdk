import React, { Component } from 'react';
import { connect } from 'react-redux';
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
import { actionCreators as repoActions } from '../actions';
import { NAME as repoName, selector } from 'features/repos';
import { NAME as editorName, actionCreators as editorActions } from 'features/editor';
import { contextTypes } from 'utils/ReactDecorators';
import { TOOLBAR_HEIGHT } from 'constants/ViewConstants';

const saveable = (current) => {
	return current && current.name != "" && current.commit != "" && current.description != "";
}

const LoadIcon = () => <FontIcon>cloud_download</FontIcon>;


@connect(selector, (dispatch) => {
	return {
		actions: bindActionCreators(repoActions, dispatch),
	}
})

export default class RepoManager extends Component {

	constructor(props) {
		super(props);
		this._load = this._load.bind(this);
		this.renderSaveDialogue = this.renderSaveDialogue.bind(this);
		this.renderSaveAsDialogue = this.renderSaveAsDialogue.bind(this);
	}

	renderSaveAsDialogue() {

		const { repos: { tosave: { name, description, commit }, saveasdialogue, savedialogue } } = this.props;
		const { nameChanged, descriptionChanged, commitChanged, savePressed, toggleSaveAsDialogue, toggleSaveDialogue } = this.props.actions;
		const onClose = saveasdialogue ? toggleSaveAsDialogue : toggleSaveDialogue;

		const nameprops = {
			value: name,
			id: "name",
			onChange: (property, event) => {
				nameChanged(event.target.value);
			}
		}

		const descriptionprops = {
			value: description,
			id: "description",
			onChange: (property, event) => {
				descriptionChanged(event.target.value);
			}
		}

		const commitprops = {
			value: commit,
			id: "commit",
			onChange: (property, event) => {
				commitChanged(event.target.value);
			}
		}

		const nameinput = <div className="centered">
			<Textfield {...nameprops} />
		</div>

		const descriptioninput = <Textarea {...descriptionprops} />
		const commitinput = <Textarea {...commitprops} />

		const dialogueprops = {
			cancel: onClose,
			ok: () => { savePressed(); onClose() },
			title: "create new repo",
		}

		const dialoguecontent = <Cells>
			<div>
				<div className="centered">
					save as new repo
										</div>
			</div>
			<Cell title={"name"} content={nameinput} />
			<Cell title={"description"} content={descriptioninput} />
			<Cell title={"commit message"} content={commitinput} />
		</Cells>

		return <Dialogue {...dialogueprops}>
			{dialoguecontent}
		</Dialogue>
	}

	renderSaveDialogue() {

		const { repos: { loaded, browsingname, tosave: { name, description, commit } } } = this.props;
		const { nameChanged, descriptionChanged, commitChanged, savePressed, commitPressed, toggleSaveDialogue } = this.props.actions;

		if (!loaded || (!loaded.sha.flows && !loaded.sha.manifest)) {
			return this.renderSaveAsDialogue();
		}

		const nameprops = {
			value: name,
			id: "name",
			onChange: (property, event) => {
				nameChanged(event.target.value);
			}
		}

		const descriptionprops = {
			value: description,
			id: "description",
			onChange: (property, event) => {
				descriptionChanged(event.target.value);
			}
		}

		const commitprops = {
			value: commit,
			id: "commit",
			onChange: (property, event) => {
				commitChanged(event.target.value);
			}
		}

		const nameinput = <div className="centered">
			<Textfield {...nameprops} />
		</div>

		const descriptioninput = <Textarea {...descriptionprops} />
		const commitinput = <Textarea {...commitprops} />

		const dialogueprops = {
			cancel: toggleSaveDialogue,
			ok: () => { commitPressed(); toggleSaveDialogue() },
			title: "save update",
		};

		const dialoguecontent = <Cells>
			<div>
				<div className="centered">
					save
										</div>
			</div>
			<Cell title={"commit message"} content={commitinput} />
		</Cells>



		return <Dialogue {...dialogueprops}>{dialoguecontent}</Dialogue>
	}


	componentDidMount() {
		this.props.actions.requestRepos();
	}

	render() {

		const { repos: { repos, visible, savedialogue, saveasdialogue } } = this.props;
		const { toggleSaveAsDialogue } = this.props.actions;
		const close = <Button icon onClick={this.props.actions.toggleVisible}>close</Button>;
		let dialogue = null;

		const _repos = repos.map((repo) => {

			const avatar = <Avatar src={repo.icon} role="presentation" />

			return <ListItem onClick={this._load.bind(null, repo.name)} key={repo.name}
				leftAvatar={avatar}
				rightIcon={<LoadIcon />}
				primaryText={repo.name.replace("databox.", "")}
				secondaryText={repo.description || "no description provided"}
			/>

		});

		const header = (
			<Toolbar
				colored
				title={`your repos`}
				actions={close}
				className="md-divider-border md-divider-border--bottom"
				style={{ background: "#303030" }}
			/>
		);




		return <div>
			<Drawer
				position="right"
				header={header}
				visible={visible}
				onVisibilityToggle={() => { }}
			>
				<div style={{ height: `calc(100vh - ${TOOLBAR_HEIGHT}px)`, overflowY: 'auto' }}>
					<List style={{ width: "100%" }}>
						{_repos}
					</List>
				</div>
			</Drawer>
			{savedialogue && this.renderSaveDialogue()}
			{saveasdialogue && this.renderSaveAsDialogue()}
		</div>
	}

	_load(repo) {
		this.props.actions.fetchFlow(repo);
	}
}