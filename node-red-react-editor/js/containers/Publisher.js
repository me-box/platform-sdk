import React from 'react';
import {TOOLBAR_HEIGHT, PALETTE_WIDTH, SIDEBAR_WIDTH, WORKSPACE_FOOTER} from '../constants/ViewConstants';
import cx from 'classnames';
import '../../style/sass/cells.scss';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import Textfield from '../components/form/Textfield';
import Textarea from '../components/form/Textarea';

class Publisher extends React.Component {
	
	constructor(props){
        super(props);
    }
	
	render() {
		
		const {packages, dispatch} = this.props;
		
		const style ={
			position: 'absolute',
			left: PALETTE_WIDTH, 
			width: `calc(100vw - ${PALETTE_WIDTH}px)`,
			height: `calc(100vh - ${TOOLBAR_HEIGHT+WORKSPACE_FOOTER}px)`,
			background: 'rgba(255,255,255,0.9)',
		
		}
	
		return( <div id="publisher" style={style}>
                	<div className="flexcontainer">
                		<Details />
                		<Packages packages={this.props.packages}/>
        				<Combinations packages={this.props.packages}/>   	
			    	</div>
			    </div>
		);
	}
	
}

class Details extends React.Component {

	render(){
	
		const nameprops =  {	
								value: 	"",
				 				id: "name",
								onChange:(property, event)=>{
                  					
              					}
							}
		
		const descriptionprops = {	
									value: 	"",
				 					id: "description",
									onChange:(property, event)=>{
                  						
              						}
								 }
		
		const tagprops =  {	
								value: 	"",
				 				id: "tags",
								onChange:(property, event)=>{
                  					
              					}
							}
												 					
		const nameinput = <Textfield {...nameprops}/>												
		const descriptioninput = <Textarea {...descriptionprops}/>							
		const taginput = <Textfield {...tagprops}/>	
							  					
		return <div className="flexcolumn">
			<div className="headerstyle">
				<div className="centered"> app details </div>
			</div>
	

			<div>
				<div className="flexrow">
					<div className="title">
						<div className="centered">
							app name
						</div>
					</div>
					{nameinput}	
				</div>
			</div>
			
			<div>
				<div className="flexrow">
					<div className="title">
						<div className="centered">
							app description
						</div>
					</div>
					{descriptioninput}
				</div>
			</div>
			<div>	
				<div className="flexrow">
					<div className="title">
						<div className="centered">
							tags
						</div>
					</div>
					{taginput}
				</div>
			</div>	
		</div>        				
        				
	}
}


class Packages extends React.Component {
	
					 
	
	render(){
	
		const packages = this.props.packages.map((pkg,i)=>{
			return <div key={i}>
						<div className="centered">
							<div className="button">{pkg.label}</div>
						</div>
					</div>
		})
		
		const install = ["optional", "compulsory"].map((type,i)=>{
			return <div key={i}>
						<div className="centered">
							<div className="button">{type}</div>
						</div>
					</div>
		});
		
		const descriptionprops = {	
									value: 	"",
				 					id: "description",
									onChange:(property, event)=>{
                  						
              						}
								 }
												
		const descriptioninput = <Textarea {...descriptionprops}/>	
		
		const benefitsprops = {	
									value: 	"",
				 					id: "description",
									onChange:(property, event)=>{
                  						
              						}
								 }
		const benefitsinput = <Textarea {...benefitsprops}/>		
		
		return <div className="flexcolumn">
			
					<div className="headerstyle">
						<div className="centered"> packages </div>
					</div>
			
					<div>	
						<div className="flexrow">
							<div className="title">
								<div className="centered">
									package
								</div>
							</div>
							<div>
								<div className="flexrow">
									{packages}
								</div>
							</div>
						</div>
					</div>	
					<div>	
						<div className="flexrow">
							<div className="title">
								<div className="centered">
									description
								</div>
							</div>
							{descriptioninput}
						</div>
					</div>	
					<div>	
						<div className="flexrow">
							<div className="title">
								<div className="centered">
									install
								</div>
							</div>
							<div>
								<div className="flexrow">
									{install}
								</div>
							</div>
						</div>
					</div>	
					<div>	
						<div className="flexrow">
							<div className="title">
								<div className="centered">
									datastores
								</div>
							</div>
							<div>
								<div className="centered">
							
								</div>
							</div>
						</div>
					</div>	
					<div>	
						<div className="flexrow">
							<div className="title">
								<div className="centered">
									outputs
								</div>
							</div>
							<div>
								<div className="centered">
							
								</div>
							</div>
						</div>
					</div>	
					<div>	
						<div className="flexrow">
							<div className="title">
								<div className="centered">
									risk
								</div>
							</div>
							<div>
								<div className="centered">
									This package has been calculated to incur a <strong> MEDIUM </strong> risk
								</div>
							</div>
						</div>
					</div>	
					<div>	
						<div className="flexrow">
							<div className="title">
								<div className="centered">
									benefits
								</div>
							</div>
							{benefitsinput}
						</div>
					</div>	
				</div>
		}
}

class Combinations extends React.Component {

	render(){
	
		const header = this.props.packages.map((pkg, i)=>{
			return <div key={i} className="header">
						<div className="centered">{pkg.label}</div>
					</div>
		});
		
		const rows = this.props.packages.map((pkg, i)=>{
			const packagerows = this.props.packages.map((row, j)=>{
				if (i===j){
					return <div key={j} className="disabled"></div>
				}
				return <div key={j}> <div className="centered">  x </div> </div>
			});
			
			return <div key={i}>
						<div className="flexrow">
							<div className="title">
								<div className="centered">
									{pkg.label}
								</div>
							</div>
							{packagerows}
						</div>
					</div>
		});
		
		return <div className="flexcolumn">                			
					<div className="headerstyle">
						<div className="centered"> permitted install combinations </div>
					</div>
			
					<div>	
						<div className="flexrow">
							<div className="title"> </div>
							{header}
						</div>
					</div>
			
					{rows}
				</div>
        				
	}
}


function select(state) {
  return {
      packages: state.tabs.tabs,
  };
}

export default connect(select)(Publisher);