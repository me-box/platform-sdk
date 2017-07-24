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
import 'brace/theme/github';
import {configNode} from 'utils/ReactDecorators';

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
            
            return  <div  onClick={this._createInputCode.bind(null, _node)} key={i} style={iconstyle}>
                  <i className={`fa ${_node._def.icon} fa-fw`}></i>
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
          
        return  <div onClick={this._createOutputCode.bind(null, _node)} key={i} style={iconstyle}>
                <i className={`fa ${_node._def.icon} fa-fw`}></i>
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
            
            return  <div onClick={()=>{
                                    this._createInputType(_node);
                                    this.setState({selected:"inputtypedef"})}} key={i} style={iconstyle}>
                        <i className={`fa ${_node._def.icon} fa-fw`}></i>
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
        
        return  <div onClick={()=>{
                                    this._createOutputType(_node);
                                    this.setState({selected:"outputtypedef"})}} key={i} style={iconstyle}>

                 <i className={`fa ${_node._def.icon} fa-fw`}></i>
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

    renderCodeInput(){

      const {node, values={}, updateNode} = this.props;

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

    render() {
      
      return <div>
          			<Cells>				
      						<Cell title="name" content={this.renderNameInput()}/>
      						<Cell title="input type" content={this.renderTypeInput()}/>
                  <Cell title="output type" content={this.renderTypeOutput()}/>
                  <Cell title={"external libraries"} content={this.renderLibraries()}/>
      						<Cell title={"function"} content={this.renderCodeInput()}/>
      						<Cell title={"outputs"} content={this.renderSelectOutput()}/>
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