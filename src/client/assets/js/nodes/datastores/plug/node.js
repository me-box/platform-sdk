import React, { PropTypes, Component } from 'react';
import Textfield from 'components/form/Textfield';
import Select from 'components/form/Select';
import Cell from 'components/Cell';
import Cells from 'components/Cells';
import { configNode } from 'utils/ReactDecorators';

@configNode()
export default class Node extends Component {

    render() {

        const { node, values = {}, updateNode, updateOutputSchema } = this.props;

        const nameprops = {
            id: "name",
            value: this.props.values.name || "",

            onChange: (property, event) => {
                this.props.updateNode(property, event.target.value);
            },
        }

        const typeprops = {

            options: [
                { name: 'power', value: 'TP-Power-Usage' },
                { name: 'on/off', value: 'TP-PowerState' },
            ],

            onSelect: (event) => {
                updateNode("subtype", event.target.value);
            },

            label: "subtype",
            itemLabel: "name",
            itemValue: "value",
            helpText: "Select a subtype!",
            value: values.subtype || ""
        }

        const typeinput = <div className="centered">
            <Select {...typeprops} />
        </div>

        const nameinput = <div className="centered">
            <Textfield {...nameprops} />
        </div>
        return <div>
            <Cells>
                <Cell title={"name"} content={nameinput} />
                <Cell title={"type"} content={typeinput} />
            </Cells>
        </div>
    }
}