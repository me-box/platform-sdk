import React, { Component, PropTypes } from 'react';
import TemplateList from './TemplateList';
import { NAME } from '../';
export default class PaletteLayout extends Component {
  static propTypes = {
    ///actions: PropTypes.object.isRequired,
    //templates: PropTypes.object.isRequired
  };

  constructor(props){
    super(props);
   
  }

  componentWillMount(){
    const {nid, actions: {loadSVGTemplates}} = this.props;
    console.log("LSVGT");
    console.log(loadSVGTemplates);
    loadSVGTemplates(nid);
  }

  render() {
  
    const { [NAME] : { templatesById, selected }, actions, nid } = this.props;
  
    return (
      <div className="paletteList">
        <TemplateList nid={nid} templates={templatesById} selected={selected} actions={actions} />
      </div>
    );
    
  }
}
