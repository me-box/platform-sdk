import React, { Component } from 'react';
import Textfield from 'components/form/Textfield';
import Select from 'components/form/Select';

const dwidth = "400";

const extract = (msg, path) => {
    return path.reduce((acc, item) => {
        return acc[item];
    }, msg)
}

export default class Schema extends React.Component {

    constructor(props){
        super(props);
        this.payload = this.payload.bind(this);
        this.formatprimitive = this.formatprimitive.bind(this);
        this.formatobject = this.formatobject.bind(this);
        this.formatoneof = this.formatoneof.bind(this);
        this.formatenum = this.formatenum.bind(this);
        this.formatany = this.formatany.bind(this);
        this.updateMessage = this.updateMessage.bind(this);
        this.state = {};
    }

    updateMessage(property, value){
       
        this.setState({[property]:value});
        this.props.onChange({...this.props.message, ...this.state, [property]:value});
    }

    payload(schema){
  
        if (!schema)
            return null;
    
        return Object.keys(schema).map((key,i)=>{
            const item = schema[key];
            const type = item.type.toLowerCase();
           
            if (type === "object"){ 
                return this.formatobject(item,key); 
            }			
            if (type==="oneof"){
                return this.formatoneof(item, key);
            }
            if (type==="any"){
                return this.formatany(item,key);
            }
            return this.formatprimitive(item,key);
        });
    }

    formatany(item, key, attributestyle={}){

        const {rule} = this.props;
        const value = extract(rule.outputMessage, key.split(".")) || ""
      
        const anyprops = {
            id: "any",
            value,
            onChange: (property, event) => {
                this.updateMessage(property, event.target.value);
            },
        }
        return <div key={key}>
                    <div className="flexrow">
                        <div className="attributetitle" style={attributestyle}>
                            <div className="centered">
                                <strong>{key}</strong>
                            </div>
                        </div>
                        
                         <div className="fixed" style={{borderRight: '1px solid #b6b6b6',  width:`${dwidth}`}}>
                            <div className="schemadescription">
                                <div dangerouslySetInnerHTML={{__html: item.description || ""}}></div>
                            </div>
                        </div>

                         <div style={{borderRight: '1px solid #b6b6b6'}}>
                            <div className="centered">
                            <Textfield {...anyprops}/>
                            </div>
                        </div>
                    </div>
                </div>
    }

    formatprimitive(item,key, attributestyle={}){
        const {id, selectedid="", rule} = this.props;
        const value = extract(rule.outputMessage, key.split(".")) || "";

        if (item.enum){
            return this.formatenum(item,key);
        }
    
        const primitiveprops = {
            id: "primitive",
            value,
            onChange: (property, event) => {
                this.updateMessage(property, event.target.value);
            },
        }
    
    
        return <div key={key}>
                    <div className="flexrow">
                        <div className="attributetitle" style={attributestyle}>
                            <div className="centered">
                                <strong>{key}</strong>
                            </div>
                        </div>
                        
                        <div className="fixed" style={{borderRight: '1px solid #b6b6b6',  width:`${dwidth}`}}>
                            <div className="schemadescription">
                                <div dangerouslySetInnerHTML={{__html: (item.description || "").replace("[id]", id).replace("[selectedid]", selectedid)}}></div>
                            </div>
                        </div>

                         <div style={{borderRight: '1px solid #b6b6b6'}}>
                            <div className="centered">
                            <Textfield {...primitiveprops}/>
                            </div>
                        </div>
                    </div>
                </div>
    }

    formatobject(item,key){
        return 	<div key={key}>
                    <div className="flexrow">
                    
                        <div className="attributetitle">
                            <div className="centered">
                                <strong>{key}</strong>
                            </div>
                        </div>
                        <div  style={{borderRight: '1px solid #b6b6b6'}}>
                            <div className="flexcolumn">
                                {this.payload(item.properties)}
                            </div>
                        </div>
                    </div>
                   </div>
    }

    formatoneof(item,key){
        const {rule} = this.props;
        const selected =  rule.outputMessage[item.selector] || this.state[item.selector];
        
        const currentItem = item.oneOf.find(i=>i.value===selected) || {};
        const value = extract(rule.outputMessage, key.split(".")) || "";

        const oneofprops = {
            id: key,
            value,
            onChange: (property, event) => {
                this.updateMessage(property, event.target.value);
            },
        }
        return 	<div key={key}>
                    <div className="flexrow">
                    
                        <div className="attributetitle">
                            <div className="centered">
                                <strong>{key}</strong>
                            </div>
                        </div>
                        <div className="fixed" style={{borderRight: '1px solid #b6b6b6', width:`${dwidth}`}}>
                            <div className="flexcolumn">
                            <div className="schemadescription">
                                 {currentItem.description}
                                 </div>
                            </div>
                        </div>
                        <div style={{borderRight: '1px solid #b6b6b6'}}>
                            <div className="centered">
                           
                                <Textfield {...oneofprops}/>
                            </div>
                        </div>
                    </div>
                </div>
    }

    formatenum(item,key, attributestyle={}){
        const {id, selectedid="", rule} = this.props;
        const value = extract(rule.outputMessage, key.split(".")) || item.enum[0];

        const selectprops = {
            id,
            value,
            options: item.enum.map(e=>({name:e, value:e})),
            onSelect: (e) => {
                this.updateMessage(key, e.target.value);
             },
        }
        return <div key={key}>
                    <div className="flexrow">
                        <div className="attributetitle" style={attributestyle}>
                            <div className="centered">
                                <strong>{key}</strong>
                            </div>
                        </div>
                        
                        <div className="fixed" style={{borderRight: '1px solid #b6b6b6', width:`${dwidth}`}}>
                            <div className="schemadescription">
                                <div dangerouslySetInnerHTML={{__html: (item.description || "").replace("[id]", id).replace("[selectedid]", selectedid)}}></div>
                            </div>
                        </div>
                        <div style={{borderRight: '1px solid #b6b6b6'}}>
                            <div className="centered">
                            <Select {...selectprops}/>
                            </div>
                        </div>
                    </div>
                </div>
    }

	render(){

		const {schema} = this.props;

		if (!schema || Object.keys(schema).length <= 0){ 
            return null;
        }
		
		const payload = schema.type === "object" ? this.payload(schema.properties) : this.formatprimitive(schema, "");

		
		return 	<div key={this.props.id} className="flexcolumn schema">
					<div className="noborder">
						<div className="flexrow">
							<div>
								<div className="flexcolumn">
									<div>
										<div className="flexrow">
											<div className="title" style={{borderTop: '1px solid #b6b6b6'}}>
												<div className="centered">
													attribute name
												</div>
											</div>
                                            <div className="header fixed" style={{width:`${dwidth}`}}>
												<div className="centered">
													description
												</div>
											</div>
											<div className="header">
												<div className="centered">
												value
												</div>
											</div>
											
										</div>
									</div>
									{payload}
								</div>
							</div>
					   </div>
					</div>
				</div>

	}  
}