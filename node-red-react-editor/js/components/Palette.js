import React from 'react';
import spinner from '../../style/images/spin.svg';

class Palette extends React.Component {
	render() {
	    console.log("the nodes in the palette are");
        console.log(this.props.nodes);
        
		return( 
			<div id="palette">
        		<img src={spinner} className="palette-spinner hide"/>
        		<div id="palette-search">
            		<i className="fa fa-search"></i>
            		<input id="palette-search-input" type="text" data-i18n="[placeholder]palette.filter"/>
            		<a href="#" id="palette-search-clear">
            			<i className="fa fa-times"></i>
            		</a>
        		</div>
        		<div id="palette-container" className="palette-scroll"></div>
        		<div id="palette-footer">
            		<a className="palette-button" id="palette-collapse-all" href="#">
            			<i className="fa fa-angle-double-up"></i>
            		</a>
            		<a className="palette-button" id="palette-expand-all" href="#">
            			<i className="fa fa-angle-double-down"></i>
            		</a>
        		</div>
    		</div>
		);
	}
}

export default Palette;