import React from 'react';
import Textfield from 'components/form/Textfield';
import Textarea from 'components/form/Textarea';
import Select from 'components/form/Select';
import Cell from 'components/Cell';
import Cells from 'components/Cells';
import {matchLibraries} from 'utils/utils';
import {codeFromSchema} from 'utils/codegen';
import brace from 'brace';
import AceEditor from 'react-ace';
import 'brace/mode/javascript';
import 'brace/mode/json';
//import 'brace/theme/github';
import {configNode} from 'utils/ReactDecorators';
const  jsontoflow = require("json-schema-to-flow-type");

@configNode()
export default class Node extends React.Component {

    constructor(props){
	   		super(props);
        this.state={selected:null};
	   		this._createInputCode = this._createInputCode.bind(this);
	   		this._createOutputCode = this._createOutputCode.bind(this);
        this._createInputType = this._createInputType.bind(this);
        this._createOutputType = this._createOutputType.bind(this);
    }
	   
    renderInputCodeGenerators(){
        const {node, inputs=[]} = this.props;
        return inputs.map((_node, i)=>{
            
            const iconstyle = {
                alignSelf: 'center',
                height: 40,
                width: 40,
                color:'white',
                background: _node.color || '#ca2525',
                border: '2px solid white', 
                textAlign: 'center',
                boxShadow: '0 3px 8px 0 rgba(0, 0, 0, 0.1), 0 6px 20px 0 rgba(0, 0, 0, 0.09)',
                marginTop: 5,
                paddingTop: 5,
                color: 'white',
                fontSize: 30,
                WebkitFlex: '0 0 auto',
            }
            
            return  <div  onClick={this._createInputCode.bind(null, _node)} key={i} style={iconstyle}>
                  <i className={`fa ${_node.icon} fa-fw`}></i>
                </div>
      });

    }

    renderOutputCodeGenerators(){
      const {node, outputs=[]} = this.props;
      return outputs.map((_node, i)=>{
            
        const iconstyle = {
            alignSelf: 'center',
            height: 40,
            width: 40,
            color:'white',
            background: _node.color || '#ca2525',
            border: '2px solid white', 
            textAlign: 'center',
            boxShadow: '0 3px 8px 0 rgba(0, 0, 0, 0.1), 0 6px 20px 0 rgba(0, 0, 0, 0.09)',
            marginTop: 5,
            paddingTop: 5,
            color: 'white',
            fontSize: 30,
            WebkitFlex: '0 0 auto',
        }
          
        return  <div onClick={this._createOutputCode.bind(null, _node)} key={i} style={iconstyle}>
                <i className={`fa ${_node.icon} fa-fw`}></i>
              </div>
      });
    }

    renderInputTypeGenerators(){
        const {node, inputs=[]} = this.props;

        return inputs.map((_node, i)=>{
            
            const iconstyle = {
                alignSelf: 'center',
                height: 40,
                width: 40,
                color:'white',
                background: _node.color || '#ca2525',
                border: '2px solid white', 
                textAlign: 'center',
                boxShadow: '0 3px 8px 0 rgba(0, 0, 0, 0.1), 0 6px 20px 0 rgba(0, 0, 0, 0.09)',
                marginTop: 5,
                paddingTop: 5,
                color: 'white',
                fontSize: 30,
                WebkitFlex: '0 0 auto',
            }
            
            return  <div onClick={()=>{
                        this._createInputType(_node);
                        this.setState({selected:"inputtypedef"})}} key={i} style={iconstyle}>
                        <i className={`fa ${_node.icon} fa-fw`}></i>
                    </div>
      });
    }

    renderOutputTypeGenerators(){
      
      const {node, outputs=[]} = this.props;

      return outputs.map((_node, i)=>{
          
        const iconstyle = {
            alignSelf: 'center',
            height: 40,
            width: 40,
            color:'white',
            background: _node.color || '#ca2525',
            border: '2px solid white', 
            textAlign: 'center',
            boxShadow: '0 3px 8px 0 rgba(0, 0, 0, 0.1), 0 6px 20px 0 rgba(0, 0, 0, 0.09)',
            marginTop: 5,
            paddingTop: 5,
            color: 'white',
            fontSize: 30,
            WebkitFlex: '0 0 auto',
        }
        
        return  <div onClick={()=>{
                                    this._createOutputType(_node);
                                    this.setState({selected:"outputtypedef"})}} key={i} style={iconstyle}>

                 <i className={`fa ${_node.icon} fa-fw`}></i>
                </div>
      });
    }

    renderTypeInput(){

       const {node, values={}, updateNode} = this.props;

       const inputtypeprops = {
          onChange: (value)=>{
              updateNode("inputtypedef", value);
          },
          onFocus: ()=>{
            this.setState({selected:"inputtypedef"})
          },
          onBlur: ()=>{
            this.setState({selected:null})
          },
          value: values.inputtypedef || node.inputtypedef || "",
          mode: "json",
          theme: "github",
          name: `type-${node.id}`,
          editorProps:{$blockScrolling: true},
          height: '200px',
          width: '100%',
          showPrintMargin: false,
      }   

      const inputstyle = {
          height: this.state.selected === "inputtypedef" ? 200 : 50,
          overflowY: 'auto',
      }

      return <div className="flexrow" style={inputstyle}>
                <div style={{width:50, background:"#333", color:"white"}}>
                  <div className="flexcolumn">
                    {this.renderInputTypeGenerators()}
                  </div>
                </div>
                <AceEditor {...inputtypeprops}/>
              </div>              
    }

    renderTypeOutput(){
       const {node, values={}, updateNode} = this.props;

       const outputtypeprops = {
          onChange: (value)=>{
              updateNode("outputtypedef", value);
          },
          onFocus: ()=>{
            this.setState({selected:"outputtypedef"})
          },
          onBlur: ()=>{
            this.setState({selected:null})
          },
          value: values.outputtypedef || node.outputtypedef || "",
          mode: "json",
          theme: "github",
          name: `type-${node.id}`,
          editorProps:{$blockScrolling: true},
          height: '200px',
          width: '100%',
          showPrintMargin: false,
      }   
      
      const outputstyle = {
          height: this.state.selected === "outputtypedef" ? 200 : 50,
          overflowY: 'auto',
      }


      return <div className="flexrow" style={outputstyle}>
                <div style={{width:50, background:"#333", color:"white"}}>
                  <div className="flexcolumn">
                    {this.renderOutputTypeGenerators()}
                  </div>
                </div>

                <AceEditor {...outputtypeprops}/>
              </div>          
    }

    _getReturnFromItem(obj, returns){
        
       
        
        if (!obj){
          return [];
        }
        
        switch(obj.type){
          case "ReturnStatement":
            if (obj.argument){ 
              return [...returns, Object.keys(obj.argument)
                                      .filter((i)=>["loc","range"].indexOf(i)==-1)
                                      .reduce((acc,key)=>{
                                        acc[key] = obj.argument[key]
                                        return acc;
                                      },{})];
            }
            return returns;

          case "IfStatement":
            return [...returns, ...this._getReturnFromItem(obj.consequent, []),  ...this._getReturnFromItem(obj.alternate, [])] 

          case "BlockStatement":
            return obj.body.reduce((acc, item)=>{
                return [...acc, ...this._getReturnFromItem(item, [])];
            },returns);

          case "SwitchStatement":
            return (obj.cases || []).reduce((acc,c)=>{
              return [...acc, ...c.consequent.reduce((acc,item)=>{
                 return [...acc, ...this._getReturnFromItem(item,[])];
              },[])];

            },returns);
          
          default:
            return;
        }
    }
    

    _getTypeFor(rawType){

        try{
          if (rawType[0] === "\""){
            return "string";
          }
        }catch(err){

        }

        if (!isNaN(rawType)){
          return "number";
        }
        
        return "literal";
    }

    _extractproperties(properties){

        return properties.reduce((acc, property)=>{
            if (property.type === "Property"){
                if (property.value.type === "ObjectExpression"){
                  acc[property.key.name] = {
                      type: "object",
                      properties: this._extractproperties(property.value.properties)
                  }
                }
                else{
                  acc[property.key.name || property.key.value] = {type:this._getTypeFor(property.value.raw)}
                }
                return acc;
            }
        },{})
    }

    _schemafy(statements){
        
        return statements.map((statement)=>{  
            if (statement.type === "ObjectExpression"){
              return {
                  type: "object",
                  properties: this._extractproperties(statement.properties),
              }
            }
        })
    }

    _checkSchema(inputs, outputs, value){
      
      /*
      
      // commented this out for now as this is the type checking part - at moment only build output json schema
          
      const _out = outputs.reduce((acc, node)=>{
        const id = node.name||node.type
        const schema = node.schema ? node.schema.input : {};
        return  {id : id.charAt(0).toUpperCase() + id.slice(1), schema: jsontoflow.parseSchema({...schema, id:node.name||node.type})};
      },{id:"", schema:""});
            
  
      let intype = "";
      let inschema = "";

      if (inputs.length == 1){
        const _n = inputs[0].schema ? inputs[0].schema.output : {};
        inschema = jsontoflow.parseSchema({..._n, id:"msg"})
        intype   = "msg:Msg";
      }
      
      if (inputs.length > 1){
        intype = "msg:mixed";
      }
      
    
      const toparse = `${inschema} (${intype})=>{${value}}`;
      */

      const toparse = `()=>{${value}}`;

      try{
        
        const parsed = flow.parse(toparse,{});
       
        if (parsed.errors.length <= 0){
          const statement = parsed.body.reduce((acc,item)=>{
            if (item.type === "ExpressionStatement"){
              return item;
            }
          },{});
          
          console.log("statement is", statement);

          const returnstatement = statement.expression.body.body.reduce((acc,obj)=>{
            return [...acc, this._getReturnFromItem(obj,[])];
          },[]).filter(i=>i ? i.length > 0 : false);

          const schemas = this._schemafy(returnstatement[0]);
          if (schemas.length > 0){
             this.props.updateNode("outputtypedef", JSON.stringify(schemas[0],null,4));
          }
        }

        //const fn = `${inschema} ${_out.schema} (${intype}):${_out.id || "any"}=>{${value}}`;
        //console.log(flow.checkContent("-", `${fn}`));*/
      }
      catch(e){
        console.log("parse failure!");
      }
    }

    renderCodeInput(){

      const {node, outputs=[], inputs=[], values={}, updateNode} = this.props;

      const aceprops = {

        onChange: (value)=>{
            
            
            /*const _in = inputs.reduce((acc, node)=>{
               const schema = node.schema ? node.schema.output : {}; 
               return {id:"Msg", schema:jsontoflow.parseSchema({...schema, id:"msg"})};
            },{id:"",schema:""});

            console.log(_in);*/
            
            this._checkSchema(inputs, outputs, value);

           
            //console.log("output code is",  jsontoflow.parseSchema({...schema, id:node.name || node.type}));
            

            updateNode("func", value);
        },

        value: values.func,
        mode: "javascript",
        theme: "github",
        name: node.id,
        editorProps:{$blockScrolling: true},
        height: '300px',
        width: '100%',
        showPrintMargin: false,
      }
      
      return <div className="flexrow">
                  <div style={{width:50, background:"#333", color:"white"}}>
                    <div className="flexcolumn">
                      <div style={{WebkitFlex: '0 0 auto'}}>
                        <div className="centered">
                          <div style={{color:"white", fontSize:14}}>in</div>
                        </div>
                      </div>
                      {this.renderInputCodeGenerators()}
                      <div style={{WebkitFlex: '0 0 auto'}}>
                        <div className="centered">
                          <div style={{color:"white", fontSize:14}}>out</div>
                        </div>
                      </div>
                      {this.renderOutputCodeGenerators()}
                    </div>
                  </div>
                  <AceEditor {...aceprops}/>
              </div>          
    }

    renderSelectOutput(){
      
      const {node, values={}, updateNode} = this.props;

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
      
      return  <div className="centered">
                <Select {...outputprops}/>                       
              </div>
    }


    renderNameInput(){
      const {node, values={}, updateNode} = this.props;

      const nameprops = { 
          value:  values.name || node.name || "",
          id: "name",
          onChange:(property, event)=>{
             updateNode(property, event.target.value);
          }
      }

      return  <div className="centered">
                <Textfield {...nameprops}/>                        
              </div>
    }

    renderLibraries(){
      
      const {node, values={}} = this.props;

      return <div style={{padding: 8}}>
                <strong>{matchLibraries(values.func || node.func || "").join(", ")}</strong>
             </div>
    }
    //<Cell title="input schema" content={this.renderTypeInput()}/>
    render() {
        
      return <div>
          			<Cells>				
      						<Cell title="name" content={this.renderNameInput()}/>						
                  <Cell title="external libraries" content={this.renderLibraries()}/>
      						<Cell title="function" content={this.renderCodeInput()}/>
      						<Cell title="outputs" content={this.renderSelectOutput()}/>
                  
                  <Cell title="output schema" content={this.renderTypeOutput()}/>
          			</Cells>
          	 </div>
    }

    _createInputType(node){
        const {values={}} = this.props;
        const typedef = node.schema ? node.schema.output : {};
        this.props.updateNode("inputtypedef", JSON.stringify(typedef,null,4));
    }

    _createOutputType(node){
        const {values={}} = this.props;
        const typedef = node.schema ? node.schema.input : {};
        this.props.updateNode("outputtypedef", JSON.stringify(typedef,null,4));
    }
       
    _createInputCode(node){
      const {values={}} = this.props;
      const schema = node.schema ? node.schema.output : {};
      const code = codeFromSchema(schema, "input");
      const func = `${values.func || ""}\n${code}`;
      this.props.updateNode("func", func);
    }
     
    _createOutputCode(node){
     	const {values={}} = this.props;
      const schema = node.schema ? node.schema.input : {};
     	const code = codeFromSchema(schema, "output");
      const func = `${values.func || ""}\n${code}`;
      this.props.updateNode("func", func);
    }
}