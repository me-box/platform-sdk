import React from 'react';
import composeNode from '../../../utils/composeNode';
import {reducer} from './reducer';
import cx from 'classnames';
import Textfield from '../../../components/form/Textfield';
class Node extends React.Component {
	   
       render() {
        
          const {selected, inputs, values, updateNode} = this.props;
        
         console.log("INPUTS ARE");
         console.log(inputs);
         
          const chart = values.chart || "bar";
          
          const leftborder = {
          	borderLeft: "1px solid #b6b6b6",
          	background: "#f2f2f2"
          }
          
          const wrap = {
          	flexWrap: 'wrap',
          	WebkitFlexWrap: 'wrap',
          }
          
          const seen = {};
          
          //only show items that are datastores, and dedup
          const grid = inputs.filter((input)=>{
             if  (input._def.category === "datastores"){
             	return seen.hasOwnProperty(input.type) ? false : (seen[input.type] = true);
             }
             return false;
          }).map(function(input,i){
          	
          	const name = input.type; 
          	
          	const xoptions = Object.keys(input._def.schema).map((key)=>{
          		const xtype =  values.xtype;
          		
          		const className = cx({
          			button: true,
          			selected: xtype ? xtype.source === name && xtype.type===key : false,
          		});
          		
          		return 	<div key={key}>
          					<div onClick={()=>{updateNode("xtype", {source:input.type, type:key})}} className={className}>{key}</div>
          				</div>
          	})
          	
          	const yoptions = Object.keys(input._def.schema).map((key)=>{
          		
          		const ytype =  values.ytype;
          		const className = cx({
          			button: true,
          			selected: ytype ? ytype.source === name && ytype.type===key : false,
          		});
          		return 	<div key={key}>
          					<div  onClick={()=>{updateNode("ytype", {source:input.type, type:key})}} className={className}>{key}</div>
          				</div>	
          	})
          	
          	 
			return	<div key={name}>
						<div className="flexrow">
							<div className="title">	
								<div className="centered">
									{name}
								</div>
							</div>
							<div>
								<div className="flexrow" style={wrap}>
									{xoptions}
								</div>
							</div>
							{chart === "bar" && <div style={leftborder}>
								<div className="flexrow" style={wrap}>
									{yoptions}
								</div>
							</div>}
						 </div>
					</div>
					
          });   
          
         
          
          const charts = ["bar", "gauge"].map((type)=>{
          	
          	
          	const className = cx({
          		button: true,
          		selected: type === chart,
          	});
          	return <div key={type}>
          			 	<div className="centered">
          			 		<div onClick={ ()=>{updateNode("chart", type)} } className={className}>{type}</div>
          			 	</div>
          			</div>
          });
          
          const xlabelprops = {	
								value: 	this.props.values.xlabel || "",
				 				id: "xlabel",
				 				placeholder: "y label",
								onChange:(property, event)=>{
                  					 this.props.updateNode(property, event.target.value);
              					}
							}	
		
		  const ylabelprops = {	
								value: 	this.props.values.ylabel || "",
				 				id: "ylabel",
				 				placeholder: "y label",
								onChange:(property, event)=>{
                  					 this.props.updateNode(property, event.target.value);
              					}
							}	
							
		  const yaxismin = {	
								value: 	this.props.values.yaxismin || "",
				 				id: "yaxismin",
				 				placeholder: "(leave blank for auto)",
								onChange:(property, event)=>{
                  					 this.props.updateNode(property, event.target.value);
              					}
							}	
		  
		  const yaxismax = {	
								value: 	this.props.values.yaxismax || "",
				 				id: "yaxismax",
				 				placeholder: "(leave blank for auto)",
								onChange:(property, event)=>{
                  					 this.props.updateNode(property, event.target.value);
              					}
							}	
		   const maxreadings = {	
								value: 	this.props.values.maxreadings,
				 				id: "maxreadings",
				 				
								onChange:(property, event)=>{
                  					 this.props.updateNode(property, event.target.value);
              					}
							}
			
			 const ticks = {	
								value: 	this.props.values.ticks,
				 				id: "ticks",
								onChange:(property, event)=>{
                  					 this.props.updateNode(property, event.target.value);
              					}
							}
																						
          const barchartoptions =  <div className="flexcolumn">
          							
          							<div>
										<div className="flexrow">
											<div className="title">
												<div className="centered">
													xaxis label
												</div>
											</div>
											<div>
												<div className="centered">
													<Textfield {...xlabelprops}/>	 
												</div>
											</div>
											<div className="title">
												<div className="centered">
													yaxis label
												</div>
											</div>
											<div>
												<div className="centered">
													<Textfield {...ylabelprops}/>	 
												</div>
											</div>
										</div>
									</div>
									<div>
										<div className="flexrow">
											<div className="title">
												<div className="centered">
													y axis min
												</div>
											</div>
											<div>
												<div className="centered">
												<Textfield {...yaxismin}/>	 
												</div>
											</div>
											<div className="title">
												<div className="centered">
													y axis max
												</div>
											</div>
											<div>
												<div className="centered">
												<Textfield {...yaxismax}/>	 
												</div>
											</div>
										</div>
									</div>
									<div>
										<div className="flexrow">
											<div className="title">
												<div className="centered">
													maxreadings
												</div>
											</div>
											<div>
												<div className="centered">
												<Textfield {...maxreadings}/>	
												</div>
											</div>
											<div className="title">
												<div className="centered">
													ticks
												</div>
											</div>
											<div>
												<div className="centered">
												 <Textfield {...ticks}/>	
												</div>
											</div>
										</div>
									</div>
          					    </div>
          
           const gaugeoptions =  <div className="flexcolumn">
									<div>
										<div className="flexrow">
											<div className="title">
												<div className="centered">
													ticks
												</div>
											</div>
											<div>
												<div className="centered">
												 <Textfield {...ticks}/>	
												</div>
											</div>
										</div>
									</div>
          					    </div>
          
          const nameprops = {	
								value: 	this.props.values.name || "",
				 				id: "name",
								onChange:(property, event)=>{
                  					 this.props.updateNode(property, event.target.value);
              					}
							}
		
		  const titleprops = {	
								value: 	this.props.values.title || "",
				 				id: "title",
								onChange:(property, event)=>{
                  					 this.props.updateNode(property, event.target.value);
              					}
							}				
						  
          return  <div className="flexcolumn">
          			<div>
          				<div className="flexrow">
          					<div className="title">
          						<div className="centered">
          							name
          						</div>
          					</div>
          					<div>
          						<div className="centered">
          							<Textfield {...nameprops}/>	 
          						</div>
          					</div>
          				</div>
          			</div>
          			
          			<div>
          				<div className="centered">
          					<h4> chart options </h4>
          				</div>
          			</div>
          			
          			
          			<div>
          				<div className="flexrow">
          					<div className="title">
          						<div className="centered">
          							chart title
          						</div>
          					</div>
          					<div>
          						<div className="centered">
          							<Textfield {...titleprops}/>	 
          						</div>
          					</div>
          				</div>
          			</div>
          			<div>
          				<div className="flexrow">
          					<div className="title">
          						<div className="centered">
          							type
          						</div>
          					</div>
          					<div>
          						
								{charts}
								
							</div>
						</div>
          			</div>
          			
          		  	{chart==="bar" && barchartoptions}
          		  	{chart==="gauge" && gaugeoptions}
          		  	
          		  	<div>
          				<div className="centered">
          					<h4> chart sources </h4>
          				</div>
          			</div>
          			
          		  	<div>
          				<div className="flexrow">
          					<div className="title">
          						<div className="centered">
          							source
          						</div>
          					</div>
          					<div className="header">
          						<div className="centered">
          						x values
          						</div>
          					</div>
          					{ chart === "bar" && <div className="header">
          						<div className="centered">
          						y values
          						</div>
          					</div>}
          				</div>
          			</div>
          		  	{grid}
          		  	
          		  </div>
          
       }    
}

export default composeNode(Node, 'chartify', 
                            {
                                category: 'processors',    
                                color: '#002255',
                                defaults: {             
                                    name: {value:""},
                                    title: {value:""},
                                    chart: {value:"bar"},
                                    xlabel: {value:""},
                                    ylabel: {value:""},
                                    yaxismin: {value:""},
                                    yaxismax: {value:""},
                                    maxreadings: {value: ""},
                                    ticks : {value:""},
                                    xtype: {value:{}},
                                    ytype: {value:{}},
                                },
                                
                                inputs:1,               
                                outputs:1,             
                               
                                icon: "fa-bar-chart",    
                                unicode: '\uf080',    
                                label: function() {     
                                    return this.name || "chartify";
                                },
                                
                                description: "<p> This node will take in datastore data of the form <code> values:[{object}, {object}] </code> and convert it to data for a chart </p>",
                                 
                                labelStyle: function() { 
                                    return this.name?"node_label_italic":"";
                                }
                            }, /*reducer*/
                          );
