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
    //const {actions} = this.props;
    //this.props.actions.loadSVGTemplates();
  }

  render() {
  
    const { [NAME] : { templatesById, selected }, actions } = this.props;
  
    return (
      <div className="paletteList">
        <TemplateList templates={templatesById} selected={selected} actions={actions} />
      </div>
    );
    
  }
}
