import React, { PureComponent } from 'react';
import { actionCreators as templateActions } from 'nodes/processors/uibuilder/features/canvas/';
import { selector } from '../..';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

@connect(selector, (dispatch) => {
  return {
      actions: bindActionCreators(templateActions, dispatch)
  }
})
export default class Death extends PureComponent {
  
  
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <div>
        <ul>
          <li>
              <strong> never </strong>
          </li>
          <li>
              <strong> when data is x </strong>
          </li>
          <li>
              <strong> after x new data events </strong>
          </li>
          <li>
              <strong> a function </strong>
          </li>
        </ul>
      </div>
    );
  }

}