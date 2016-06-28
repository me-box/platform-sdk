import React from 'react';
import {TOOLBAR_HEIGHT, PALETTE_WIDTH, SIDEBAR_WIDTH, WORKSPACE_FOOTER} from '../constants/ViewConstants';
import cx from 'classnames';
import '../../style/sass/cells.scss';
import { bindActionCreators } from 'redux';
import * as PublisherActions from '../actions/PublisherActions';
import { connect } from 'react-redux';
import Textfield from '../components/form/Textfield';
import Textarea from '../components/form/Textarea';

class Publisher extends React.Component {
	
	constructor(props){
        super(props);
        Object.assign(this, ...bindActionCreators(PublisherActions, props.dispatch));
    }
	
	render() {
		
		const {packages, pkg, app, grid, dispatch} = this.props;
		
		const style ={
			position: 'absolute',
			left: PALETTE_WIDTH, 
			width: `calc(100vw - ${PALETTE_WIDTH}px)`,
			height: `calc(100vh - ${TOOLBAR_HEIGHT+WORKSPACE_FOOTER}px)`,
			background: '#fff',
			overflowY: 'auto'
		}
	
		const detailprops = {
			updateAppDescription: this.updateAppDescription,
			updateAppName: this.updateAppName,
			updateAppTags: this.updateAppTags,
			app: app,
			
		}
		
		const packagesprops = {
			packageSelected: this.packageSelected,
			installSelected: this.installSelected,
			updatePackageDescription: this.updatePackageDescription,
			updatePackageBenefits: this.updatePackageBenefits,
			packages: this.props.packages,
			selected: this.props.pkg || {},
		}
		
		const combiprops = {
			packages: this.props.packages,
			grid: this.props.grid,
			toggleGrid: this.toggleGrid,
		}
		
		return( <div id="publisher" style={style}>
                	<div className="flexcontainer">
                		<Details {...detailprops} />
                		<Packages {...packagesprops}/>
        				<Combinations {...combiprops}/>   	
			    	</div>
			    </div>
		);
	}
	
}

class Details extends React.Component {

	render(){
	
		const nameprops =  {	
								value: 	this.props.app.name || "",
				 				id: "name",
								onChange:(property, event)=>{
                  					this.props.updateAppName(event.target.value);
              					}
							}
		
		const descriptionprops = {	
									value: 	this.props.app.description || "",
				 					id: "description",
									onChange:(property, event)=>{
                  						this.props.updateAppDescription(event.target.value);
              						}
								 }
		
		const tagprops =  {	
								value: 	this.props.app.tags || "",
				 				id: "tags",
								onChange:(property, event)=>{
                  					this.props.updateAppTags(event.target.value);
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
			
			
			const className = cx({
				button: true,
				selected: pkg.id ===  this.props.selected.id,
			});
			
			return <div key={i}>
						<div className="centered">
							<div className={className} onClick={this.props.packageSelected.bind(this, pkg.id)}>{pkg.name}</div>
						</div>
					</div>
		})
		
		const install = ["optional", "compulsory"].map((type,i)=>{
			
			const className = cx({
				button: true,
				selected: this.props.selected.install === type,
			});
			
			return <div key={i}>
						<div className="centered">
							<div onClick={this.props.installSelected.bind(this, type)} className={className}>{type}</div>
						</div>
					</div>
		});
		
		const outputs = (this.props.selected.outputs || []).map((output,i)=>{		
			return <Node key={i} {...output}/>
		});
		
		const datastores = (this.props.selected.datastores || []).map((datastore,i)=>{		
			return <Node key={i} {...datastore}/>
		});
		
		const descriptionprops = {	
									value: 	this.props.selected.description,
				 					id: "description",
									onChange:(property, event)=>{
                  						this.props.updatePackageDescription(event.target.value);
              						}
								 }
												
		const descriptioninput = <Textarea {...descriptionprops}/>	
		
		const benefitsprops = {	
									value: 	this.props.selected.benefits,
				 					id: "description",
									onChange:(property, event)=>{
                  						this.props.updatePackageBenefits(event.target.value);
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
							{datastores}
						</div>
					</div>	
					<div>	
						<div className="flexrow">
							<div className="title">
								<div className="centered">
									outputs
								</div>
							</div>
							{outputs}
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
									This package is rated as <strong> MEDIUM </strong> risk
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

	constructor(props){
        super(props);
        this._toggleGrid = this._toggleGrid.bind(this);
    }
    
	render(){
	
		const style = {
			color: '#777',
		}
		
		const header = this.props.packages.map((pkg, i)=>{
			return <div key={i} className="header">
						<div className="centered">{pkg.name}</div>
					</div>
		});
		
		const rows = this.props.packages.map((pkg, i)=>{
			const packagerows = this.props.packages.map((row, j)=>{
			
			    const permitted = this.props.grid.filter((item)=>{
			    	return  (item[0] === pkg.id && item[1] === row.id) || (item[0] === row.id && item[1] === pkg.id)
			    }).length <= 0;
			    
			    const compulsory = (pkg.install === "compulsory" || row.install === "compulsory");
				
				const cstyle ={
					background: compulsory ? "#f3f3f3" : "#fff",
				}
				
			    const className= cx({
						'fa': true,
						'fa-check': permitted || compulsory,
						'fa-times': !permitted && !compulsory,
						'fa-1x': true,
						'fa-fw' : true,
				});
		
				if (i===j){
					return <div key={j} className="disabled"></div>
				}
				return <div style={cstyle} onClick={this._toggleGrid.bind(this, pkg, row)} key={j}> 
							<div className="centered"> 
								<i style={style} className={className}></i>
							</div> 
						</div>
			});
			
			return <div key={i}>
						<div className="flexrow">
							<div className="title">
								<div className="centered">
									{pkg.name}
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
	
	_toggleGrid(pkga, pkgb){
		if (pkga.install != "compulsory" && pkgb.install != "compulsory"){
			this.props.toggleGrid(pkga.id, pkgb.id);
		}
	}
}	


class Node extends React.Component {

	render(){
		const style = {
				background: this.props.color,	
		}
			
		const labelstyle = {
			textTransform: 'uppercase',
			fontSize: '0.75em',
			marginBottom: 10,
		}
		
		const className= cx({
			'fa': true,
			[this.props.icon]: true,
			'fa-3x': true,
			'fa-fw' : true,
		});
			
		return  <div>
					<div className="centered" >
						<div style={style} className="publishernode">
							<i className={className}></i>
						</div>
						<div style={labelstyle}>{this.props.type}</div>
					</div>
				</div>
				
	}
	
}


function select(state) {
  return {
      packages: state.publisher.packages,
      pkg: state.publisher.packages[state.publisher.currentpkg],
      app: state.publisher.app,
      grid: state.publisher.grid,
  };
}

export default connect(select)(Publisher);