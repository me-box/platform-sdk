import React from 'react';
import Chart from './Chart';

class Workspace extends React.Component {
	
	render() {
		
		return( <div>
					<ul id="workspace-tabs"></ul>
		    		<div id="workspace-add-tab">
		    			<a id="btn-workspace-add-tab" href="#">
		    			<i className="fa fa-plus"></i></a>
		    		</div>
		    		<Chart />
		    		<div id="workspace-toolbar"></div>
		    		<div id="workspace-footer">
			            <a className="workspace-footer-button" id="btn-zoom-out" href="#">
			            	<i className="fa fa-minus"></i>
			            </a>
			            <a className="workspace-footer-button" id="btn-zoom-zero" href="#">
			            	<i className="fa fa-circle-o"></i>
			            </a>
			            <a className="workspace-footer-button" id="btn-zoom-in" href="#">
			            	<i className="fa fa-plus"></i>
			            </a>
			        </div>
			    </div>
		);
	}
}

export default Workspace;