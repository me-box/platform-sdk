import React from 'react';
import composeNode from '../../../utils/composeNode';
import {reducer} from './reducer';
import cx from 'classnames';

class Node extends React.Component {

	   
       render() {
        
          const {selected, inputs, values, updateNode} = this.props;
          
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
          		const xtype =  values.xtype || selected.xtype;
          		
          		const className = cx({
          			button: true,
          			selected: xtype ? xtype.source === name && xtype.type===key : false,
          		});
          		
          		return 	<div key={key} className="centered">
          					<div onClick={()=>{updateNode("xtype", {source:input.type, type:key})}} className={className}>{key}</div>
          				</div>
          	})
          	
          	const yoptions = Object.keys(input._def.schema).map((key)=>{
          		
          		const ytype =  values.ytype || selected.ytype;
          		const className = cx({
          			button: true,
          			selected: ytype ? ytype.source === name && ytype.type===key : false,
          		});
          		return 	<div key={key} className="centered">
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
							<div >
								<div className="flexrow" style={wrap}>
									{xoptions}
								</div>
							</div>
							<div style={leftborder}>
								<div className="flexrow" style={wrap}>
									{yoptions}
								</div>
							</div>
						 </div>
					</div>
					
          });   
          
          
          const charts = ["line", "bar", "gauge"].map((type)=>{
          	const chart = values.chart || selected.chart || "";
          	
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
          return  <div className="flexcolumn">
          			<div>
          				<div className="flexrow">
							{charts}
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
          					<div className="header">
          						<div className="centered">
          						y values
          						</div>
          					</div>
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
                                    xtype: {},
                                    ytype: {}, 
                                    chart: "bar", 
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
