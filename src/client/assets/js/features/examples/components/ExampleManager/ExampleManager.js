import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';


import Drawer from 'react-md/lib/Drawers';
import Toolbar from 'react-md/lib/Toolbars';
import Button from 'react-md/lib/Buttons';
import Avatar from 'react-md/lib/Avatars';
import ListItem from 'react-md/lib/Lists/ListItem';
import List from 'react-md/lib/Lists/List';
import FontIcon from 'react-md/lib/FontIcons';
//import {toggleSave} from '../actions/ToolbarActions';

import cx from 'classnames';
import { NAME as examplesName, selector, actionCreators as exampleActions } from 'features/examples';
import { actionCreators as repoActions } from 'features/repos/actions';

import { contextTypes } from 'utils/ReactDecorators';
import { TOOLBAR_HEIGHT } from 'constants/ViewConstants';

const LoadIcon = () => <FontIcon>cloud_download</FontIcon>;

@connect(selector, (dispatch) => {
	return {
		actions: {
			...bindActionCreators(exampleActions, dispatch),
			fetchExamples: bindActionCreators(repoActions.fetchExamples, dispatch),
			fetchExample: bindActionCreators(repoActions.fetchExample, dispatch),

		}
	}
})
@contextTypes({ store: React.PropTypes.object })
export default class ExampleManager extends Component {

	constructor(props) {
		super(props);
		this._load = this._load.bind(this);
	}

	componentDidMount() {
		this.props.actions.fetchExamples();
	}

	render() {

		const { examples, visible } = this.props;
		const close = <Button icon onClick={this.props.actions.toggleVisible}>close</Button>;
		let dialogue = null;

		const _examples = examples.map((example) => {
			const avatar = <Avatar src={example.icon} role="presentation" />
			return <ListItem onClick={this._load.bind(null, example.name, example.username)} key={example.name}
				leftAvatar={avatar}
				rightIcon={<LoadIcon />}
				primaryText={example.name}
				secondaryText={example.description || "no description provided"}
			/>

		});

		const header = (
			<Toolbar
				colored
				title={`databox app examples`}
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
						{_examples}
					</List>
				</div>
			</Drawer>
		</div>
	}

	_load(name, username) {
		this.props.actions.fetchExample(name, username);
	}
}