import React, {Component} from 'react';
import {TOOLBAR_HEIGHT, PALETTE_WIDTH, SIDEBAR_WIDTH, WORKSPACE_FOOTER} from 'constants/ViewConstants';
import cx from 'classnames';
import { bindActionCreators } from 'redux';
import { NAME, actionCreators as workspaceActions, selector  as workspaceSelector} from '../';
import { selector as riskSelector } from 'features/risk';

import { actionCreators as repoActions} from 'features/repos/actions';
import { connect } from 'react-redux';
import Textfield from 'components/form/Textfield';
import Textarea from 'components/form/Textarea';
import FontIcon from 'react-md/lib/FontIcons';

const combiselector = (state)=>{	
	return {
		...workspaceSelector(state),
		...riskSelector(state),
	}
}

@connect(combiselector, (dispatch) => {
  	return{
     actions: 	{
     				...bindActionCreators(workspaceActions, dispatch),
     		   		publish: bindActionCreators(repoActions.publish, dispatch)
     			}
  	}
})
export default class Publisher extends Component {
	
	constructor(props){
        super(props);
        this.renderDetails = this.renderDetails.bind(this);
        this.renderRisk = this.renderRisk.bind(this);
        this.renderRating = this.renderRating.bind(this);
    }


    renderDetails(){

    	const {workspace:{app}, selectedPackage} = this.props;

    	const nameprops =  {	
								value: 	app.name || "",
				 				id: "name",
								onChange:(property, event)=>{
                  					this.props.actions.updateAppName(event.target.value);
              					}
							}
		
		const descriptionprops = {	
									value: 	app.description || "",
				 					id: "description",
									onChange:(property, event)=>{
                  						this.props.actions.updateAppDescription(event.target.value);
              						}
								 }
		
		const tagprops =  {	
								value: 	app.tags || "",
				 				id: "tags",
								onChange:(property, event)=>{
                  					this.props.actions.updateAppTags(event.target.value);
              					}
							}
		
		const purposeprops = {	
									value: 	selectedPackage.purpose,
				 					id: "purpose",
									onChange:(property, event)=>{
                  						this.props.actions.updatePackagePurpose(event.target.value);
              						}
								 }
		
		const benefitsprops = {	
									value: 	selectedPackage.benefits,
				 					id: "benefits",
									onChange:(property, event)=>{
                  						this.props.actions.updatePackageBenefits(event.target.value);
              						}
								 }
		

		const nameinput = <Textfield {...nameprops}/>												
		const descriptioninput = <Textarea {...descriptionprops}/>							
		const taginput = <Textfield {...tagprops}/>	
		const purposeinput = <Textarea {...purposeprops}/>	
		const benefitsinput = <Textarea {...benefitsprops}/>

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
			<div>	
				<div className="flexrow">
					<div className="title">
						<div className="centered">
							purpose
						</div>
					</div>
					{purposeinput}
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

    renderRating(){
    	const {rating} = this.props;
    	const score =   [...Array(rating)].map((i)=>{
	       return <FontIcon key={i}>security</FontIcon>
	    });
	    return <div>{score}</div>
    }

    renderRisk(){

    	
    	const { risks} = this.props;

    	const datastores = (this.props.datastores || []).map((datastore,i)=>{		
			return <Node key={i} {...datastore}/>
		});
		

		const riskItems = risks.map((r,i)=>{

	        const iconclass = cx({
	          fa: true,
	          faFw: true,
	          [r.icon]: true,
	        });

	        const iconStyle={
	          alignSelf: 'center',
	          height: '2em',
	          width: '2em',
	          background: r.color,
	          lineHeight: '1.8em',
	          textAlign: 'center',
	          boxShadow: 'rgba(0, 0, 0, 0.9) 0px 3px 8px 0px, rgba(0, 0, 0, 0.09) 0px 6px 20px 0px',
	          color: 'white'
	        } 

	        const score = [...Array(r.score)].map((i)=>{
	            return <FontIcon key={i}>security</FontIcon>
	        });

	        const riskItem = {
				flex: "0 0 auto",
				width: 50,
				padding:7,
	        }

	        const riskReason ={
	        	padding: 7,
	        	border: 'none'
	        }

	        const riskScore = {
	        	flex: "0 0 auto",
	        	width: 150,
	        	padding: 10,
	        	border: 'none',
	        }

	        return  <div style={{border:'none'}}>
		        		<div className="flexrow" key={i}>
		                  <div style={riskItem}>
		                    <div style={iconStyle}>
		                      <i className={iconclass}></i>
		                    </div>
		                  </div>
		                  <div style={riskReason}>
		                    {r.reason}
		                  </div>
		                  <div style={riskScore}>
		                    {score}
		                  </div>
		                </div>
	                </div>
	    });


		return <div className="flexcolumn">
			
					<div className="headerstyle">
						<div className="centered"> risks </div>
					</div>
					
					<div>	
						<div className="flexrow">
							<div className="title">
								<div className="centered">
									risk breakdown
								</div>
							</div>
							<div className="flexcolumn">
								{riskItems}
							</div>
						</div>
					</div>	
					<div>	
						<div className="flexrow">
							<div className="title">
								<div className="centered">
									rating
								</div>
							</div>
							<div>
								<div className="centered">
									{this.renderRating()}
								</div>
							</div>
						</div>
					</div>	
				</div>
    }
	
	render() {
		
		const {workspace:{app, grid}, packages, datastores, selectedPackage} = this.props;
		
		const style ={
			position: 'absolute',
			left: PALETTE_WIDTH, 
			width: `calc(100vw - ${PALETTE_WIDTH}px)`,
			height: `calc(100vh - ${TOOLBAR_HEIGHT+WORKSPACE_FOOTER}px)`,
			background: '#fff',
			overflowY: 'auto'
		}
		
		const submitprops = {
			submit: this.props.actions.publish,
			cancel: this.props.actions.cancel,	
		}
		
		let installstatus;
		
		if (status){
			const statusprops = {
				status: status,
				left: PALETTE_WIDTH, 
				width: `calc(100vw - ${PALETTE_WIDTH}px)`,
				height: `calc(100vh - ${TOOLBAR_HEIGHT+WORKSPACE_FOOTER}px)`,
			}
			installstatus = <Status {...statusprops}/>	
		}
		 
		return( <div id="publisher" style={style}>
                	<div className="flexcontainer">
                		{this.renderDetails()}
                		{this.renderRisk()}
        				<Submit {...submitprops}/>
			    	</div>
			    </div>
		);
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
					<div className="centered" style={{width:'auto'}} >
						<div style={style} className="publishernode">
							<i className={className}></i>
						</div>
						<div style={labelstyle}>{this.props.type}</div>
					</div>
				</div>
				
	}
	
}

class Submit extends Component {

	render(){
			
		return  <div>
					<div className="flexrow" style={{background:'#445662'}}>
						<div>
							<div className="centered">
								<button onClick={this.props.cancel} className="button selected">cancel</button>
							</div>
						</div>
						<div>
							<div className="centered">
								<button onClick={this.props.submit} className="button selected">publish</button>
							</div>
						</div>
					</div>
				</div>
				
	}	
}