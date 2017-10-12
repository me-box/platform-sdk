import React, {Component} from 'react';
import cx from 'classnames';
import Textfield from 'components/form/Textfield';
import {configNode} from 'utils/ReactDecorators';


const _inputsHaveChanged = (i1,i2)=>{
	if (i2.length <= i1.length){
		return true;
	}
	return false;
}

const _validateNumber = (n)=>{
	return (!isNaN(parseFloat(n)) && isFinite(n)) || n === "";
}
       
      

@configNode()
export default class Node extends React.Component {
	   
	   
	   constructor(props){
			super(props);
            this._handleValueSelected = this._handleValueSelected.bind(this);
            this.renderBarChartOptions = this.renderBarChartOptions.bind(this);
            this.renderGaugeOptions = this.renderGaugeOptions.bind(this);
            this.renderGrid = this.renderGrid.bind(this);
           
	   }
	   
	   
	   componentDidMount(){
	   		//reset these as inputs may have changed. Could only do this if the inputs have changed, but then would need to keep track
	   		//of previous version in reducer
	   		this.props.updateNode("xtype", []);
	   		this.props.updateNode("ytype", []);
	   }

	   renderBarChartOptions(){
	   		const {values} = this.props;

	   		const ticks = {	
				value: 	values.ticks,
 				id: "ticks",
				onChange:(property, event)=>{
  					const n = event.target.value;
					if (this._validateNumber(n)){
  					 	this.props.updateNode(property, event.target.value);
					}
				}
			}

			const xlabelprops = {	
								value: 	values.xlabel || "",
				 				id: "xlabel",
				 				placeholder: "y label",
								onChange:(property, event)=>{
                  					 this.props.updateNode(property, event.target.value);
              					}
							}	
		
		  	const ylabelprops = {	
								value: 	values.ylabel || "",
				 				id: "ylabel",
				 				placeholder: "y label",
								onChange:(property, event)=>{
                  					 this.props.updateNode(property, event.target.value);
              					}
							}	
							
		  	const yaxismin = {	
								value: values.min || "",
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
								value: 	values.max || "",
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
								value: 	values.maxreadings,
				 				id: "maxreadings",
				 				
								onChange:(property, event)=>{
									const n = event.target.value;
									if (this._validateNumber(n)){
                  					 	this.props.updateNode(property, event.target.value);
              						}
              					}
							}

	   		return 	<div className="flexcolumn">
          							
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


	   }

	   
	   renderGaugeOptions(){
	   		
	   		const {values} = this.props;

	   		const ticks = {	
				value: 	values.ticks,
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

	   		return  <div className="flexcolumn">
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
											<div className="centered" style={{lineHeight:"1.8em", padding:7}}>
												use this to add labels along the outer axis of the gauge.  The format required is <i>label:number,label:number</i> where <strong>label</strong> is the word you would like displayed and <strong>number</strong> is the maximum value for which the label applies.  For example on a gauge with values from 0 to 100, to create 4 equal width labels you might write <i>low:25,medium:50,high:75,massive:100</i> Values from 0-25 will be marked 'low', 25-50 will be marked 'medium', 50-75 will be marked 'high' and 75 to 100 will be marked 'massive'.	 	 
											</div>
										</div>
									</div>
								</div>
							</div>
						</div>
					</div>
	    }


	   	renderGrid(){
	   		
	   		const {inputs=[], values} = this.props;

          	const seen = {};
 			
 			const leftborder = {
          		borderLeft: "1px solid #b6b6b6",
          		background: "#f2f2f2"
          	}

          	const wrap = {
          		flexWrap: 'wrap',
          		WebkitFlexWrap: 'wrap',
          	}
          

          	return inputs.filter((input)=>{
             	if  (input._def.category === "datastores"){
             		return seen.hasOwnProperty(input.type) ? false : (seen[input.type] = true);
             	}
             	return false;
          	}).map((input,i)=>{
          	
          		const name = input.name.trim() == "" ? input.type : input.name; 
          	
          		let schema = {};
          	
          		const {schema:{output}} = input;

	          	if (output){
	          		if (output.properties){
	          			if (output.properties.payload){
	          				schema = output.properties.payload.properties;		
	          			}
	          		}
	          	} 	
	          
	       
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
	          			greyed: schema[key].type !== "number" && schema[key].type!="time",
	          	
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
	   }

	   renderSection(section){
	   		return 	<div>
		  				<div className="centered" style={{color:'white', background:'#445662'}}>
		  					<div className="centered" style={{color:'white', background:'#445662', height: 40, lineHeight: "40px"}}>
		  						{section}
		  					</div>
		  				</div>
		          	</div>

	   }

       render() {
       
          const chart = this.props.values.chart || "bar";
          
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
						  

	   		const charts = ["bar", "gauge"].map((type)=>{
          	
	          	const className = cx({
	          		button: true,
	          		selected: type === chart,
	          	});
          		return <div key={type}>
          			 	<div className="centered">
          			 		<div onClick={ ()=>{this.props.updateNode("chart", type)} } className={className}>{type}</div>
          			 	</div>
          			</div>
          	});
          	
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
	          			
	          			{this.renderSection("chart options")}
		          			
		          			
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

          		  		{chart==="bar" && this.renderBarChartOptions()}
          		  		{chart==="gauge" && this.renderGaugeOptions()}

          		  		{this.renderSection("chart sources")}

          		  		
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


          		  		{this.renderGrid()}
          		  </div>
          
       } 

        _handleValueSelected(property, value){
       
       		 
       		 
       		if (property === "ytype" && (value.type !== "number" && value.type!=="time"))
       			return;
          	
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