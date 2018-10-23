import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { actionCreators as dpiaActions, selector } from '../..';
import Dialogue from "components/Dialogue";

import "./style.css";

@connect(selector, (dispatch) => {
    return {
        actions: { ...bindActionCreators(dpiaActions, dispatch) },
    }
})
export default class DPIA extends Component {

    constructor(props) {
        super(props);
        this.renderDPIA = this.renderDPIA.bind(this);
    }

    renderDPIA() {
        const { categories, checked, status } = this.props;


        const dialogueprops = {
            ok: (e) => { this.props.actions.toggleDPIA() },
            cancel: (e) => { this.props.actions.toggleDPIA() },
            close: (e) => { this.props.actions.toggleDPIA() },
            title: "DPIA",
        }

        const items = categories.map((c) => {



            const criteria = c.values.map(criterium => {
                const selected = checked.indexOf(criterium.id) != -1;
                return (<div className="criteria">
                    <div className="text">
                        <div>
                            <div className="title">
                                {criterium.title}
                            </div>
                            <div className="description">
                                <div dangerouslySetInnerHTML={{ __html: criterium.description }} />
                            </div>
                        </div>
                    </div>
                    <div className="check" onClick={(e) => this.props.actions.toggleChecked(criterium.id)}>
                        {selected ? "yes" : "no"}
                    </div>
                </div>)
            })

            return <div className="category">
                <div className="title">
                    {c.title}
                </div>
                <div className="description">
                    {c.description}
                </div>
                {criteria}
            </div>
        });

        return <div id="dpia">
            <Dialogue {...dialogueprops}>
                <div className="content">
                    <div className="intro">
                        <div className="text">
                            <div>
                                <div className="title">
                                    DPIA
                            </div>
                                <div className="overview">In some instances, in order to comply with <strong>EU's General Data Protection Regulation</strong>, you will need to undertake a <strong>Data Protection Impact Assessment</strong> (DPIA), prior to publishing your app.  Please answer the questions below in order to get an indication whether a DPIA <strong>may</strong> be required in this instance.
                            </div>
                            </div>
                        </div>
                        <div className="status">
                            <div className="statusbutton">
                                status: {status}
                            </div>
                        </div>
                    </div>
                    {items}
                </div>
            </Dialogue>
        </div>
    }

    render() {
        const { show } = this.props;
        return <div>
            {show && this.renderDPIA()}
        </div>
    }
}