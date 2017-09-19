import './Toolbar.scss';

//Note react is an external lib
export default class Toolbar extends React.Component {

	constructor(props){
		super(props);
	} 

	render() {
		return 	<div className="toolbar">
					{this.props.title}
				</div>
	}
};