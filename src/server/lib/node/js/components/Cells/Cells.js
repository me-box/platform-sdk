
export default class Cells extends React.Component {

	constructor(props){
		super(props);
	} 

	render() {
		return (<div className="flexcolumn">
					{this.props.children}
				</div>)
	}
};