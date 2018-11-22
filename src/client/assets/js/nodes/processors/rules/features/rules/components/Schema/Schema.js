import React, { Component } from 'react';
import Textfield from 'components/form/Textfield';
import Select from 'components/form/Select';

const _oneof = (schema, id, selectedid)=>{
    
	return schema.map((item, i)=>{
	
		let tail = null;
	
		if (item.type === "object"){
			if (item.properties){
				tail = "ob"//_oneofpayload(item, id, selectedid)
			}
		}
		else if (item.type === "oneof"){

			if (item.oneOf){
				tail = "oneof";//_oneof(item.oneOf, id, selectedid)
			}
		}
		else{
			//perhaps have a different format primitive for oneof items?
			const style = {
				background: '#2196F3',
				border: 'none',
				color: 'white',
				fontWeight: 'normal'
			}
			tail = `if ${item.key}=${item.value}, ${item.description}` ;//_formatprimitive(item,`if ${item.key}=${item.value}`,id,selectedid, style);
		}
									
		return 	<div key={i}>{tail}</div>
	});
};


export default class Schema extends React.Component {

    constructor(props){
        super(props);
        this.payload = this.payload.bind(this);
        this.formatprimitive = this.formatprimitive.bind(this);
        this.formatobject = this.formatobject.bind(this);
        this.formatoneof = this.formatoneof.bind(this);
        this.formatenum = this.formatenum.bind(this);
        this.updateMessage = this.updateMessage.bind(this);
        this.state = {};
    }

    updateMessage(property, value){
        console.log("SEEN AN UPDATE MESSAGE!!!");
        this.setState({[property]:value});
        this.props.onChange({...this.props.message, ...this.state, [property]:value});

        console.log({...this.props.message, ...this.state, [property]:value});
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
            return this.formatprimitive(item,key);
        });
    }

    formatprimitive(item,key){
        const {id, selectedid=""} = this.props;
        if (item.enum){
            return this.formatenum(item,key);
        }
    
        const nameprops = {
            id: "name",
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
                        
                        <div className="fixed" style={{borderRight: '1px solid #b6b6b6', width:400}}>
                            <div className="schemadescription">
                                <div dangerouslySetInnerHTML={{__html: (item.description || "").replace("[id]", id).replace("[selectedid]", selectedid)}}></div>
                            </div>
                        </div>
                        <div style={{borderRight: '1px solid #b6b6b6'}}>
                            <div className="centered">
                            <Textfield {...nameprops}/>
                            </div>
                        </div>
                    </div>
                </div>
    }

    formatobject(item,key){
        const nameprops = {
            id: "name",
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
                        <div className="fixed" style={{borderRight: '1px solid #b6b6b6', width: 400}}>
                            <div className="flexcolumn">
                                {this.payload(item.properties)}
                            </div>
                        </div>
                        <div style={{borderRight: '1px solid #b6b6b6'}}>
                            <div className="centered">
                                <Textfield {...nameprops}/>
                            </div>
                        </div>
                    </div>
                   </div>
    }

    formatoneof(item,key){
        const selected = this.state[item.selector] || "";
        const currentItem = item.oneOf.find(i=>i.value===selected) || {};

        const nameprops = {
            id: key,
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
                        <div className="fixed" style={{borderRight: '1px solid #b6b6b6', width: 400}}>
                            <div className="flexcolumn">
                            <div className="schemadescription">
                                 {currentItem.description}
                                 </div>
                            </div>
                        </div>
                        <div style={{borderRight: '1px solid #b6b6b6'}}>
                            <div className="centered">
                           
                                <Textfield {...nameprops}/>
                            </div>
                        </div>
                    </div>
                </div>
    }

    formatenum(item,key, attributestyle={}){
        const {id, selectedid=""} = this.props;
        const selectprops = {
            id,
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
                        
                        <div className="fixed" style={{borderRight: '1px solid #b6b6b6', width:400}}>
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

		const {schema, id, selectedid=""} = this.props;

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
                                            <div className="header fixed" style={{width:400}}>
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