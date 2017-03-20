import React, { Component } from 'react';
//import '../../style/sass/cells.scss';

class NodeInfo extends Component {
	
	constructor(props){
		super(props);
	} 

	render() {
	
		const {node} = this.props;
		
		if (!node)
			return null;
			
		let contentstyle = {
			display: '-webkit-flex',
            display: 'flex',   
            WebkitFlexFlow: 'column',
            flexFlow: 'column',
            textAlign: 'center',
            width: '100%',
        }
		
		let iconstyle = {
            alignSelf: 'center',
            height: '7em',
            width: '7em',
            color:'white',
            fontWeight: 'regular',
            background: node._def.color || '#ca2525',
            border: '2px solid white', 
            lineHeight: '10em',
            textAlign: 'center',
            boxShadow: '0 3px 8px 0 rgba(0, 0, 0, 0.1), 0 6px 20px 0 rgba(0, 0, 0, 0.09)',
            marginBottom: '2em',
            color: '#445662',
        }

        let descriptionstyle = {
        	color: '#4d4d4d',
        	textAlign: 'left',
        	padding: 15,
        	lineHeight: '1.4em',
        	WebkitFontSmoothing: 'antialiased',
            textRendering: 'optimizeLegibility',
        }

        let titleStyle = {
        	textAlign: 'center',
        	marginTop: 0,
        	marginBottom: '1.5em',

        }
        
		return 	<div style={contentstyle}>
					<div style={iconstyle}><i className={`fa ${node._def.icon} fa-5x fa-fw`}></i></div>
        			<hr/>
        			<div style={descriptionstyle}>
        				<h4 style={titleStyle}> {node.type} </h4>
        				<div dangerouslySetInnerHTML={{__html: node._def.description()}}></div>
        			</div>
        		</div>
	}
};

export default NodeInfo;
