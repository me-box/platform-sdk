import React from 'react';
import composeNode from 'utils/composeNode';
import Textfield from 'components/form/Textfield';
import Select from 'components/form/Select';
import Cell from 'components/Cell';
import Cells from 'components/Cells';
import {matchLibraries} from 'utils/utils';
import {codeFromSchema} from 'utils/codegen';
import brace from 'brace';
import AceEditor from 'react-ace';
import 'brace/mode/java';
import 'brace/theme/github';
import {configNode} from 'utils/ReactDecorators';

@configNode()
export default class Node extends React.Component {

	   constructor(props){
	   		super(props);
	   		this._createInputCode = this._createInputCode.bind(this);
	   		this._createOutputCode = this._createOutputCode.bind(this);
	   }
	   
      render() {
          
        const {node, values={}, inputs=[], outputs=[], updateNode} = this.props;
            
        console.log("in function and values are");
        console.log(values);
        const libraries = <div style={{padding: 8}}>
            					           <strong>{matchLibraries(values.func || node.func || "").join(", ")}</strong>
            				        </div>
       		
			 const nameprops = {	
				  value: 	values.name || node.name || "",
				  id: "name",
				  onChange:(property, event)=>{
					   updateNode(property, event.target.value);
				  }
			 }
							
			 const nameinput = <div className="centered">
									<Textfield {...nameprops}/>												
								  </div>
	
		
			 const outputprops = {
				  options: [
					                {name: '1', value: 1},
					                {name: '2', value: 2},
					                {name: '3', value: 3},
					                {name: '4', value: 4},
					                {name: '5', value: 5},
					     ],
					     
				  onSelect: (event)=>{
					   updateNode("outputs", parseInt(event.target.value));
				  },
				  style: {width: '100%'},
				  value: values.outputs || node.outputs || "",
			}
			
			const outputselect = <div className="centered">
									             <Select {...outputprops}/>												
					                 </div>
        	
      const aceprops = {
    	
      	onChange: (value)=>{
            console.log(`updating value *${value}*`);
            updateNode("func", value);
        },
      	value: values.func || node.func || "",
    	
      	mode: "javascript",
    	
      	theme: "github",
    	
      	name: node.id,
    	
      	editorProps:{$blockScrolling: true},
    	
      	height: '300px',
    	
      	width: '100%',
    	
      	showPrintMargin: false,
      }
        	
      const incode = inputs.map((_node, i)=>{
        		
        		const iconstyle = {
      					alignSelf: 'center',
      					height: 40,
      					width: 40,
      					color:'white',
      					background: _node._def.color || '#ca2525',
      					border: '2px solid white', 
      					textAlign: 'center',
      					boxShadow: '0 3px 8px 0 rgba(0, 0, 0, 0.1), 0 6px 20px 0 rgba(0, 0, 0, 0.09)',
      					marginTop: 5,
      					paddingTop: 5,
      					color: 'white',
      					fontSize: 30,
      					WebkitFlex: '0 0 auto',
    				}
        		
        		return 	<div  onClick={this._createInputCode.bind(null, _node)} key={i} style={iconstyle}>
        					<i className={`fa ${_node._def.icon} fa-fw`}></i>
        				</div>
      });
        	
      const outcode = outputs.map((_node, i)=>{
        		
        	const iconstyle = {
    					alignSelf: 'center',
    					height: 40,
    					width: 40,
    					color:'white',
    					background: _node._def.color || '#ca2525',
    					border: '2px solid white', 
    					textAlign: 'center',
    					boxShadow: '0 3px 8px 0 rgba(0, 0, 0, 0.1), 0 6px 20px 0 rgba(0, 0, 0, 0.09)',
    					marginTop: 5,
    					paddingTop: 5,
    					color: 'white',
    					fontSize: 30,
    					WebkitFlex: '0 0 auto',
				  }
        		
        	return 	<div onClick={this._createOutputCode.bind(null, _node)} key={i} style={iconstyle}>
        					<i className={`fa ${_node._def.icon} fa-fw`}></i>
        				</div>
        	});
        	
        	const codeinput = <div className="flexrow">
                    						<div style={{width:50, background:"#333", color:"white"}}>
                    							<div className="flexcolumn">
            										<div style={{WebkitFlex: '0 0 auto'}}>
            											<div className="centered">
            												<div style={{color:"white", fontSize:14}}>in</div>
            											</div>
            										</div>
            										{incode}
            										<div style={{WebkitFlex: '0 0 auto'}}>
            											<div className="centered">
            												<div style={{color:"white", fontSize:14}}>out</div>
            											</div>
            										</div>
            										{outcode}
                    							</div>
                    						</div>
                    						<AceEditor {...aceprops}/>
            							  </div>		  				
          	return <div>
                			<Cells>				
            						<Cell title={"name"} content={nameinput}/>
            						<Cell title={"external libraries"} content={libraries}/>
            						<Cell title={"function"} content={codeinput}/>
            						<Cell title={"outputs"} content={outputselect}/>
                			</Cells>
                	 </div>
       }
       
       _createInputCode(_node){
       		const {values={}} = this.props;
          const schema = _node.schema ? _node.schema.output : {};
          const code = codeFromSchema(schema, "input");
          const func = `${code}\n${values.func || ""}`;
          this.props.updateNode("func", func);
       }
       
       _createOutputCode(_node){
       		const {values={}} = this.props;
          const schema = _node.schema ? _node.schema.input : {};
       		const code = codeFromSchema(schema, "output");
        	const func = `${values.func || ""}\n${code}`;
          this.props.updateNode("func", func);
      }
}