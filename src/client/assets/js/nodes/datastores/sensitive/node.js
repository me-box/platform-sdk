import React, {PropTypes, Component} from 'react';
import {configNode} from 'utils/ReactDecorators';
import Divider from 'react-md/lib/Dividers';
import Cell from 'components/Cell';
import Cells from 'components/Cells';
import Textfield from 'components/form/Textfield';
import Select from 'components/form/Select';
import {categories} from './categories';
import Button from 'react-md/lib/Buttons';
import cx from 'classnames';

@configNode()
export default class Node extends Component {

    constructor(props){
      super(props);
      this.renderOptions = this.renderOptions.bind(this);
      this.updateProfile = this.updateProfile.bind(this);
    }

    updateProfile(key){
      const {values={}} = this.props;
      const profiles = values.profiles || [];
      const index = profiles.indexOf(key);

      if (index == -1){
        this.props.updateNode("profiles", [...profiles,key]);
      }
      else{
        this.props.updateNode("profiles",  [...profiles.slice(0, index), ...profiles.slice(index + 1)]);
      }
    }

    renderOptions(key){
      
      const {values={}} = this.props;

      const items = categories[key].map((c)=>{
        
        const cname = cx({
          button : true,
          inlineselected: (values.profiles || []).indexOf(c) != -1,
        })

        return  <div className={cname} onClick={()=>this.updateProfile(c)}>{c.replace("_"," ")}</div>
      });

      return <div>
        {items}
      </div>
    }

    render(){
        
        const {node,values={},updateNode} = this.props;
       console.log("--> hav values", values);

        const nameprops = {
          id: "name",
          placeholder:"name",
          value: values.name || "",
          onChange: (property, event)=>{
            updateNode(property, event.target.value);
          },
        }
        
        const cats = Object.keys(categories).map((key)=>{
           return <Cell title={key} content={this.renderOptions(key)}/>
        })
  
        const nameinput = <div className="centered">
                <Textfield {...nameprops}/>                       
                </div>
        
        return  <div>
	                <Cells> 
	                  <Cell title={"name"} content={nameinput}/>
                    {cats}
	                </Cells>
                </div>
    }
}