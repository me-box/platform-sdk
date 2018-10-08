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

        const nameinput = <div className="centered">
            <Textfield {...nameprops} />
        </div>
        return <div>
            <Cells>
                <Cell title={"name"} content={nameinput} />
            </Cells>
        </div>
    }
}