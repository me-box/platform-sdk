import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import Drawer from 'react-md/lib/Drawers';
import Toolbar from 'react-md/lib/Toolbars';
import Button from 'react-md/lib/Buttons';
import { NAME, actionCreators as testActions, selector } from '../';

@connect(selector, (dispatch) => {
	return {
		actions: bindActionCreators(testActions, dispatch),
	}
})
export default class TestManager extends Component {

	constructor(props) {
		super(props);
	}

	componentDidMount() {
		this.props.actions.init();
	}


	//this is being rendered because it exists as a subcomponent of something that is re-rendering  it!

	render() {

		const { nodestotest: { nodes, error, warning }, visible, testurl, username, deploying, deployError } = this.props;
		//const { visible, testurl, username, deploying, deployError } = this.props;
		//const nodes = [], error = [], warning = [];

		console.log("in render test manager");

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
			color: 'white',
			opacity: deploying || deployError ? 0.2 : 1,
		}



		const links = nodes.map((node, i) => {
			const url = deploying || deployError ? "#" : `${testurl}?username=${username}#/${node.type}`
			return <div key={i}>
				<div className="flexrow">
					<div>
						<div style={{ margin: 'auto', padding: 20 }}>
							<div>
								<a href={url} target="_blank">
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

		const messagestyle = {
			color: '#333',
			padding: 10,
		}

		let message = "";

		const _warning = warning.join(",");

		if (error.length > 0) {
			message = error.join(",");
		}
		else if (links.length == 0) {
			message = "This flow does not have any outputs that can be viewed in test mode, currently the only supported outputs for testing are <strong>debug, app, bulbs and printer</strong>";
		}
		else if (links.length == 1) {
			message = `This flow has one output that can be viewed in test mode.  Click on it to take a look. ${warning}`;
		} else {
			message = `This flow has ${links.length} flows with outputs that can be viewed in test mode.  Click on any one to take a look. ${warning}`;
		}

		const close = <Button icon onClick={this.props.actions.toggleTest}>close</Button>;

		const header = (
			<Toolbar
				colored
				title={`test app`}
				actions={close}
				className="md-divider-border md-divider-border--bottom"
				style={{ background: "#303030" }}
			/>
		);

		return <Drawer
			position="right"
			header={header}
			visible={visible}
			onVisibilityToggle={() => { }}>
			<div>
				<div className="flexcolumn">
					<div style={messagestyle}>
						<div className="flexrow">
							<div className="centered" >
								<div dangerouslySetInnerHTML={{ __html: message }}></div>
							</div>
						</div>
					</div>
					{error.length <= 0 && links}
				</div>
			</div>
		</Drawer>



	}

}