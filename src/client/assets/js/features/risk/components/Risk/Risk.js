
import React, { Component } from 'react';
import FontIcon from 'react-md/lib/FontIcons';
import Paper from 'react-md/lib/Papers';
import { connect } from 'react-redux';
import { selector } from '../../';
import cx from 'classnames';
import "./risk.scss";

@connect(selector, (dispatch) => {
  return {}
})
export default class Risk extends Component {

  constructor(props) {
    super(props);
    this.state = { visible: false };
    this.renderIcons = this.renderIcons.bind(this);
    this.renderOverview = this.renderOverview.bind(this);
  }


  renderIcons() {
    const { rating } = this.props;

    const score = [...Array(rating)].map((i) => {
      return <FontIcon key={i}>security</FontIcon>
    });

    return <div style={{ position: "fixed", top: 0, left: 178, height: 64 }} onClick={() => this.setState({ visible: !this.state.visible })}>
      <div style={{ height: "100%", textAlign: "center", color: "white", lineHeight: "74px" }}>
        {score}
      </div>
    </div>
  }

  renderOverview() {

    const { risks } = this.props;

    const riskItems = risks.map((r, i) => {

      const iconclass = cx({
        fa: true,
        faFw: true,
        [r.icon]: true,
      });

      const iconStyle = {
        alignSelf: 'center',
        height: '2em',
        width: '2em',
        background: r.color,
        lineHeight: '1.8em',
        textAlign: 'center',
        boxShadow: 'rgba(0, 0, 0, 0.9) 0px 3px 8px 0px, rgba(0, 0, 0, 0.09) 0px 6px 20px 0px',
        color: 'white'
      }

      const score = [...Array(r.score)].map((i) => {
        return <FontIcon key={i}>security</FontIcon>
      });

      return <div className="flexrow" key={i}>
        <div className="riskItem">
          <div style={iconStyle}>
            <i className={iconclass}></i>
          </div>
        </div>
        <div className="riskOverview">
          {r.reason}
        </div>
        <div className="riskValue">
          {score}
        </div>
      </div>
    });

    return <div style={{ position: "fixed", top: 44, left: 178, background: "white" }} onClick={() => this.setState({ visible: !this.state.visible })} >
      <Paper zDepth={5} style={{ maxHeight: 400, overflowY: 'auto' }}>
        {riskItems}
      </Paper>
    </div>
  }

  render() {
    console.log("in render risk");
    return <div id="risk">
      {this.renderIcons()}
      {this.state.visible && this.renderOverview()}
    </div>
  }
}