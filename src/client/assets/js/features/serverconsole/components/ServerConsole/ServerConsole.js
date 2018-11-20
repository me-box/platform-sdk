import React, { Component } from 'react';
import { actionCreators as consoleActions, selector } from '../..';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { PALETTE_WIDTH, SIDEBAR_WIDTH } from 'constants/ViewConstants';
import cx from 'classnames';
import "./serverconsole.css";

@connect(selector, (dispatch) => {
	return {
		actions: bindActionCreators(consoleActions, dispatch),
	}
})

export default class ServerConsole extends Component {

	state = {
		category: "description",
		dragging: false,
		currentY: 0,
		currentHeight: 300,
	}

	constructor(props) {
		super(props);
		this.onDrag = this.onDrag.bind(this);
		this.onDrop = this.onDrop.bind(this);
		this.startDrag = this.startDrag.bind(this);
		this.renderMessages = this.renderMessages.bind(this);
	}


	renderMessages() {

		const { serverconsole: { messages } } = this.props;
		const _messages = messages.map((m, i) => {
			return <li key={i}>
				<span className="ts">{`[${m.ts}]`}</span>{`${m.msg}`}
			</li>
		});
		return <ul>{_messages}</ul>
	}

	startDrag(e) {
		const { clientY } = e;
		e.stopPropagation();
		this.setState({ dragging: true, currentY: clientY })
	}

	onDrop(e) {
		e.stopPropagation();
		this.setState({ dragging: false })
	}

	onDrag(e) {

		e.stopPropagation();
		const { clientY } = e;
		if (this.state.dragging) {
			this.setState({ currentHeight: this.state.currentHeight + (this.state.currentY - clientY) });
			this.setState({ currentY: clientY });

		}

	}

	render() {
		const { serverconsole: { visible }, w } = this.props;

		const style = {
			left: PALETTE_WIDTH,
			width: w - PALETTE_WIDTH,
			visible: visible,
			height: this.state.currentHeight,
			background: 'rgba(255,255,255,0.85)',
			color: 'black',
			overflowY: 'auto',
		}
		const className = cx({
			closed: !visible
		});
		const consoletitle = {
			position: "absolute",
			top: 0,
			textAlign: "center",
			color: "#303030",
			width: "100%"
		}
		return <div>
			<div className="inner" >
				<div draggable="true"
					onMouseDown={this.startDrag}
					onMouseUp={this.onDrop}
					onMouseLeave={this.onDrop}
					onMouseMove={this.onDrag}
					style={style}
					id="serverconsole"
					className={className}>
					<div style={consoletitle}>console</div>
					<div className="consolecontent">{this.renderMessages()}</div>
				</div>
			</div>
		</div>


	}
}