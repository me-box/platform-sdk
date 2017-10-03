import React, {Component} from 'react';
//import { connect } from 'react-redux';
//import * as ToolbarActions from '../actions/ToolbarActions';
//import {toggleSaveDialogue} from '../actions/RepoActions';
//import config from '../config';
import MDToolbar from 'react-md/lib/Toolbars';
import Button from 'react-md/lib/Buttons';
import Risk from 'features/risk/components/Risk';




export default class Toolbar extends Component {

  constructor(props){
  	super(props);
  } 

//<Button flat label="liveload" onClick={this.props.requestCode}/>,
  render() {
  	
  		const actions = [
  			<Risk />,
  			<Button flat label="logout" href="/auth/logout"/>,
        <Button flat label="clear" onClick={this.props.clear}/>,
  			<Button flat label="examples" onClick={this.props.toggleExamples}/>,
  			<Button flat label="load" onClick={this.props.requestRepos}/>,
  			<Button flat label="save" onClick={this.props.toggleSaveDialogue}/>,
  			<Button flat label="test" onClick={this.props.test}/>,
  			<Button flat label="publish" onClick={this.props.togglePublisher}/>
  		]
  		
  		return <MDToolbar
            colored
         	actions={actions}
            title="databox SDK"
            style={{width:"100%", position:"fixed"}}
          />
  }
}

