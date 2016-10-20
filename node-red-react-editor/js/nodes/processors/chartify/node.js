import React from 'react';
import composeNode from '../../../utils/composeNode';
import {reducer} from './reducer';
import cx from 'classnames';
import Textfield from '../../../components/form/Textfield';
class Node extends React.Component {
	   
	   
	   constructor(props){
			super(props);
            this._handleValueSelected = this._handleValueSelected.bind(this);
            this._validateNumber = this._validateNumber.bind(this);
	   }
	   
	   
	   componentDidMount(){
	   		//reset these as inputs may have changed. Could only do this if the inputs have changed, but then would need to keep track
	   		//of previous version in reducer
	   		this.props.updateNode("xtype", []);
	   		this.props.updateNode("ytype", []);
	   		
	  	 	if (this.props.values.subtype){
	   			this.props.updateOutputSchema(this.props.values.subtype);
	   		}
	   }
		
       render() {
        
          const {selected, inputs, values, updateNode, help} = this.props;
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
          }).map((input,i)=>{
          	
          	const name = input.type; 
          	const fullschema = help.outputschema[input.id] ?  help.outputschema[input.id].output : input._def.schema ? input._def.schema().output : {};
          	const schema = fullschema.payload ? fullschema.payload.schema : fullschema;
          	
          
          	const xoptions = Object.keys(schema).map((key)=>{
          		const xtype =  values.xtype || [];
          		
          		const className = cx({
          			button: true,
          			selected: xtype.filter((item)=>{
          				return (item.source === name && item.name === key)
          			}).length > 0,
          		});
          		
          		return 	<div key={key}>
          					<div onClick={()=>{this._handleValueSelected("xtype", {source:input.type, name:key, type: schema[key].type})}} className={className}>{key}</div>
          				</div>
          	})
          	
          	
          	const yoptions = Object.keys(schema).map((key)=>{
          		
          		const ytype =  values.ytype || [];
          		const className = cx({
          			button: true,
          			selected: ytype.filter((item)=>{
          				return (item.source === name && item.name === key)
          			}).length > 0,
          			greyed: schema[key].type !== "numeric" && schema[key].type!="time",
          	
          		});
          		return 	<div key={key}>
          					<div  onClick={()=>{this._handleValueSelected("ytype", {source:input.type, name:key, type: schema[key].type})}} className={className}>{key}</div>
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
          			 		<div onClick={ ()=>{updateNode("chart", type); this.props.updateOutputSchema(type)} } className={className}>{type}</div>
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
								value: 	this.props.values.min || "",
				 				id: "min",
				 				placeholder: "(leave blank for auto)",
								onChange:(property, event)=>{
                  					const n = event.target.value;
									if (this._validateNumber(n)){
                  					 	this.props.updateNode(property, event.target.value);
              						}
              					}
							}	
		  
		  const yaxismax = {	
								value: 	this.props.values.max || "",
				 				id: "max",
				 				placeholder: "(leave blank for auto)",
								onChange:(property, event)=>{
                  					const n = event.target.value;
									if (this._validateNumber(n)){
                  					 	this.props.updateNode(property, event.target.value);
              						}
              					}
							}	
		  const maxreadings = {	
								value: 	this.props.values.maxreadings,
				 				id: "maxreadings",
				 				
								onChange:(property, event)=>{
									const n = event.target.value;
									if (this._validateNumber(n)){
                  					 	this.props.updateNode(property, event.target.value);
              						}
              					}
							}
			
		  const ticks = {	
								value: 	this.props.values.ticks,
				 				id: "ticks",
								onChange:(property, event)=>{
                  					const n = event.target.value;
									if (this._validateNumber(n)){
                  					 	this.props.updateNode(property, event.target.value);
              						}
              					}
							}
		
		  const gaugemin = {
				value: 	values.min || "",
				id: "min",
				placeholder: "(leave blank for auto)",
				onChange:(property, event)=>{
					const n = event.target.value;
					if (this._validateNumber(n)){
						this.props.updateNode(property, n);
					}
				}	
		  }		
		  
		  const gaugemax = {
				value: 	values.max || "",
				id: "max",
				placeholder: "(leave blank for auto)",
				onChange:(property, event)=>{
					const n = event.target.value;
					if (this._validateNumber(n)){
						this.props.updateNode(property, n);
					}
				}	
		  }		
		  
		   const gaugelabels = {
				value: 	values.labels || "",
				id: "labels",
				placeholder: "low:25,medium:50,high:75,massive:100",
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
									<div>
										<div className="flexrow">
											<div className="title">
												<div className="centered">
													min
												</div>
											</div>
											<div>
												<div className="centered">
													<Textfield {...gaugemin}/>	 
												</div>
											</div>
											<div className="title">
												<div className="centered">
													max
												</div>
											</div>
											<div>
												<div className="centered">
													<Textfield {...gaugemax}/>	 
												</div>
											</div>
										</div>
									</div>
									<div>
										<div className="flexrow">
											<div className="title">
												<div className="centered">
													labels
												</div>
											</div>
											<div>
												<div className="flexcolumn description">
													<div>
														<div className="centered">
															<Textfield {...gaugelabels}/>	 	 
														</div>
													</div>
													<div>
														<div className="centered">
															use this to add labels along the outer axis of the gauge.  The format required is <i>label:number,label:number</i> where <strong>label</strong> is the word you would like displayed and <strong>number</strong> is the maximum value for which the label applies.  For example on a gauge with values from 0 to 100, to create 4 equal width labels you might write <i>low:25,medium:50,high:75,massive:100</i> Values from 0-25 will be marked 'low', 25-50 will be marked 'medium', 50-75 will be marked 'high' and 75 to 100 will be marked 'massive'.	 	 
														</div>
													</div>
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
          				<div className="centered" style={{color:'white', background:'#445662'}}>
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
          				<div className="centered" style={{color:'white', background:'#445662'}}>
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
       
       _validateNumber(n){
			return (!isNaN(parseFloat(n)) && isFinite(n)) || n === "";
       }
       
       _handleValueSelected(property, value){
       
       		 
       		 
       		if (property === "ytype" && (value.type !== "numeric" && value.type!=="time"))
       			return;
          	
       		//type == unique name!
       		const values = this.props.values[property] || [];
       		
       		const type = values.length > 0 ? values[0].type : null;
       		
       		//if new type is not the same as the current types, empty the array
       		if (value.type != type){
       			this.props.updateNode(property, [value]);
       			return;
       		}
       		
       		const index = values.map((source)=>{
       			return source.name;
       		}).indexOf(value.name);
       		
       		if (index == -1){
       			this.props.updateNode(property, [...values, value]);
       		}else{
       			this.props.updateNode(property, [...values.slice(0,index), ...values.slice(index+1)]);
       		}	
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
                                    min: {value:""},
                                    max: {value:""},
                                    labels: {value:""},
                                    maxreadings: {value: ""},
                                    ticks : {value:""},
                                    xtype: {value:[]},
                                    ytype: {value:[]},
                                    subtype: {value:"bar"},
                                },
                                
                                inputs:1,               
                                outputs:1,             
                               
                                icon: "fa-bar-chart",    
                                unicode: '\uf080',    
                                label: function() {     
                                    return this.name || "chartify";
                                },
                                
                                
                                schema: (chart)=>{
                                	
                                	const subtype = chart || "bar";
                                	
                                	const _payload = {
                                		
                                		"bar": {
													options: {
														type:"object",
														description: "options for rendering the chart",
														schema: {
															title : {type:"numeric", optional:true, description:"gauge title"},
															ticks:  {type:"numeric", optional:true, description:"number of values displayed on the gauge"},
															xlabel:  {type:"string", optional:true, description:"x-axis label"},
															ylabel:  {type:"string", optional:true, description:"y-axis label"},
															min: 	{type:"numeric", optional:true, description:"minimum axis value"},
															max: 	{type:"numeric", optional:true, description:"maximum axis value"},
															maxreadings:  {type:"numeric", optional:true, description:"maximum number of readings shown on chart"},
														}
													}, 
													values: {
														type:"object",
														description: "chart values",
														schema:{
															id: 	{type:"string",  optional:false, description:"id of the dataset"},
															type:	{type:"string",  optional:false, description:"<i>data</i>"}, 
															dataid: {type:"string",  optional:false, description:"id of the data item (eg timestamp)"}, 
															x:		{type:"numeric", optional:false, description:"x value"},
															y:		{type:"numeric", optional:false, description:"y value"},
														}
													}
                                		},
                                		
                                		"gauge": {
                                					options: { 
														type: "object",
														description: "options for rendering the chart",
														schema :{
																title : {type:"numeric", optional:true, description:"gauge title"},
																ticks:  {type:"numeric", optional:true, description:"number of values displayed on the gauge"},
																min: 	{type:"numeric", optional:true, description:"minimum value"},
																max: 	{type:"numeric", optional:true, description:"maximum value"},
																labels: {type:"string",  optional:true, description:"labels along the top of the chart in format name:value,name:value"},
														}
													},
													//TODO: get rid of non-essential attributes 
													values: {
														type: "object",
														description: "chart values",
														schema :{
															id: 	{type:"string",  optional:false, description:"id of the dataset"},
															type:	{type:"string",  optional:false, description:"<i>data</i>"}, 
															dataid: {type:"string",  optional:false, description:"id of the data item (eg timestamp)"}, 
															x:		{type:"numeric", optional:false, description:"value being measured"},
														}
													}
										}
                                	}
                                                                	            				
                                	return {
                                		output: {
                                			msg: {
                                					type: "object",
                                					description: "the container object",
                                					schema: {
                                						type: {type:"string", description:`<i>${subtype}</i>`},
                                						sourceId:{type:"string", description:`<i>[id]</i>`},
                                						payload: {type:"object", description:"message payload", schema:_payload[subtype]}
                                					}
                                			}
                                		},
                                		input: {
                                			name: {type:"string", description:"name of the input source"},
                                			type: {type:"string", description:"type of the input source"},
                                			subtype:{type:"string", description:"some sources (eg osmonitor) will have a subtype"},
                                			sensor:{type:"string", description: "sensingkit will send a sensor type"},
                                			_msgid: {type:"string", description:"a unique message id"},
                                			payload:{
                                				type:"object",
                                				description: "message payload",
                                				schema:{
                                					ts: {type:"ts", description:"unix timestamp"},
                                					value: {type:"any", description:"the value to be charted"}, 
                                				},
                                			}
                                		},
                                	}
                                },
                                
                                
                                description: ()=>"<p> This node will take in datastore data of the form <code> values:[{object}, {object}] </code> and convert it to data for a chart </p>",
                                 
                                labelStyle: function() { 
                                    return this.name?"node_label_italic":"";
                                }
                            }, /*reducer*/
                          );
