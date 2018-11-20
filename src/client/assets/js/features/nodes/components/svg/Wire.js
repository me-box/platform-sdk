import React, { Component } from 'react';
import { LINE_CURVE_SCALE, OUTPUT_GAP, OUTPUT_WIDTH } from 'constants/ViewConstants';

export default class Wire extends Component {

    constructor(props) {
        super(props);
        // this._path = this._path.bind(this);
    }


    _path = () => {
        const { source, target } = this.props;

        const sw = 30;
        const outputradius = OUTPUT_WIDTH / 2;
        const numOutputs = source.outputs || 1;
        const sourcePort = 0;
        const portY = -((numOutputs - 1) / 2) * OUTPUT_GAP + OUTPUT_GAP * sourcePort;

        const dx = target.x - (source.x + sw);

        let scale = LINE_CURVE_SCALE;

        if (dx < 0) {
            scale += 2 * (Math.min(outputradius * sw, Math.abs(dx)) / (outputradius * sw));
        }

        return `M ${source.x} ${source.y + outputradius}`
            + `C ${source.x + (sw * scale)} ${source.y + portY} `
            + `${target.x - scale * sw} ${target.y} `
            + `${target.x} ${target.y}`
    }

    render() {
        return <path className="drag_line" d={this._path()} />

    }
}