import React from 'react';

class Sidebar extends React.Component {
	render() {
		return( 
			 <div id="sidebar">
        		<ul id="sidebar-tabs"></ul>
        		<div id="sidebar-content"></div>
        		<div id="sidebar-footer"></div>
    		</div>
		);
	}
}

export default Sidebar;