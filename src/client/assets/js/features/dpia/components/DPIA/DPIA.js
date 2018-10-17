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
        const { categories } = this.props;

        console.log("DPIA CATEGORIES", categories);

        const dialogueprops = {
            ok: (e) => { console.log("ok clikced"); this.props.actions.toggleDPIA() },
            cancel: (e) => { console.log("cancel clikced"); this.props.actions.toggleDPIA() },
            title: "DPIA",
        }
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
                                status: DPIA recommended
                        </div>
                        </div>
                    </div>
                    <div className="category">
                        <div className="title">
                            Nature of your data
                    </div>
                        <div className="description">
                            The type of data being collected will strongly influence the likelihood and severity of risk your app exposes a user to
                    </div>
                        <div className="criteria">
                            <div className="text">
                                <div>
                                    <div className="title">
                                        Sensitive or personal  data use
                                </div>
                                    <div className="description">
                                        Your app uses [] datasources which are deemed personal and [] which are deemed sensitive.   [] is exported off the box.   Were this data exposed to third parities (either intentionally or accidentally), would it result in any serious impact on the app user's daily life or lead to any loss of rights or freedoms?
                                </div>
                                </div>
                            </div>
                            <div className="check">
                                yes
                        </div>
                        </div>
                        <div className="criteria">
                            <div className="text">
                                <div>
                                    <div className="title">
                                        Evaluation / scoring
                                </div>
                                    <div className="description">
                                        In the following nodes, personal data is being processed to generate an output. Please indicate whether any of the outputs below are used to evaluate or score, profile or predict the nature or behaviour of an app user.
                                </div>
                                </div>
                            </div>
                            <div className="check">
                                yes
                        </div>
                        </div>
                    </div>

                    <div className="category">
                        <div className="title">
                            Data usage "off the box"
                    </div>
                        <div className="description">
                            Your app is exporting data off the databox, which means that the user will relinquish control of this data.  There is an assumed elevated risk if it is used for any of the following:
                    </div>
                        <div className="criteria">
                            <div className="text">
                                <div>
                                    <div className="title">
                                        Automated decisions
                                </div>
                                    <div className="description">
                                        Will any decisions be made, without human intervention, that may significantly affect the user (for example, legal decisions or access to services or resources, credit checks, loan applications, use of machine learning?
                                </div>
                                </div>
                            </div>
                            <div className="check">
                                yes
                        </div>
                        </div>
                        <div className="criteria">
                            <div className="text">
                                <div>
                                    <div className="title">
                                        Systematic monitoring / tracking
                                </div>
                                    <div className="description">
                                        Will the data be used to monitor or track any aspect of a user or their behaviour (e.g. health data, location, occupancy, resource consumption)?
                                </div>
                                </div>
                            </div>
                            <div className="check">
                                yes
                        </div>
                        </div>
                        <div className="criteria">
                            <div className="text">
                                <div>
                                    <div className="title">
                                        Restriction of rights or access to a service / contract
                                </div>
                                    <div className="description">
                                        Will the data be used to prevent or reduce access to a service or contract, or impinge upon a user's rights (e.g. freedom of speech, freedom of thought, freedom of movement, prohibition of discrimination, right to liberty, conscience and religion)?
                                </div>
                                </div>
                            </div>
                            <div className="check">
                                yes
                        </div>
                        </div>
                        <div className="criteria">
                            <div className="text">
                                <div>
                                    <div className="title">
                                        Matching or combining datasets
                                </div>
                                    <div className="description">
                                        Will the data be combined with data from other data processing operations, performed for different purposes and/or by different data controllers in a way that would exceed the reasonable expectations of the data subject?
                                </div>
                                </div>
                            </div>
                            <div className="check">
                                yes
                        </div>
                        </div>
                    </div>


                    <div className="category">
                        <div className="title">
                            Intended user
                    </div>
                        <div className="description">
                            Certain groups of user are deemed more vulnerable to risk, and will require an enhanced risk assessment
                    </div>
                        <div className="criteria">
                            <div className="text">
                                <div>
                                    <div className="title">
                                        Typical user
                                </div>
                                    <div className="description">
                                        Is your app aimed at children or vulnerable groups (e.g. the elderly, disabled, persecuted, health impaired)?
                                </div>
                                </div>
                            </div>
                            <div className="check">
                                yes
                        </div>
                        </div>
                    </div>
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