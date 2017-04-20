import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { actionCreators as paletteActions, viewConstants, selector } from '../';
import "./Palette.scss";
import FontIcon from 'react-md/lib/FontIcons';
import Paper from 'react-md/lib/Papers';
import Button from 'react-md/lib/Buttons/Button';
import PaletteLayout from './PaletteLayout';


@connect(selector, (dispatch) => {
	return {
  		actions: bindActionCreators(paletteActions, dispatch)
	}
})
export default class Palette extends Component {

  render() {

    return (
      <Paper zDepth={2} style={{position:'absolute', overflowY:'auto', height:'100%', color:"white", background:"#03a9f4", width:viewConstants.PALETTE_WIDTH}}>
        <PaletteLayout {...this.props} />
      </Paper>
    );
  }
}