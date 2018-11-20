import React, { Component } from 'react';
import { NODE_HEIGHT, LINE_CURVE_SCALE, OUTPUT_WIDTH, OUTPUT_GAP } from 'constants/ViewConstants';
import cx from 'classnames';
import { actionCreators as linkActions, selector } from 'features/ports';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

const path = (source, sport, target) => {

    const outputradius = OUTPUT_WIDTH / 2;
    const numOutputs = source.outputs || 1;
    const sourcePort = sport || 0;
    const portY = -((numOutputs - 1) / 2) * OUTPUT_GAP + OUTPUT_GAP * sourcePort;

    const dy = target.y - (source.y + portY);
    const dx = target.x - (source.x + source.w);

    let scale = LINE_CURVE_SCALE;

    if (dx < 0) {
        scale += 2 * (Math.min(outputradius * source.w, Math.abs(dx)) / (outputradius * source.w));
    }





    const x1 = source.x + (source.w / 2) + outputradius;
    const x2 = target.x - (target.w / 2) - outputradius;
    const y1 = source.y;
    const y2 = target.y;



    return `M ${x1} ${source.y + portY}`
        + `C ${x1 + (source.w * scale)} ${y1 + portY} `
        + `${x2 - scale * source.w} ${y2} `
        + `${x2} ${y2}`
}


@connect(selector, (dispatch) => {
    return {
        actions: { ...bindActionCreators(linkActions, dispatch) },
    }
})
export default class Link extends Component {

    constructor(props) {
        super(props);
    }

    render() {

        const { id, link: { source, target, sourcePort }, selectedId, cpos = {} } = this.props;
        const { x: sx, y: sy } = cpos[source.id] || { x: source.x, y: source.y };
        const { x: tx, y: ty } = cpos[target.id] || { x: target.x, y: target.y };


        const DELTA = (source.w / 2) + OUTPUT_WIDTH / 2;

        const xpos = () => {
            if ((sx + NODE_HEIGHT) > tx) {
                return tx - DELTA;
            }
            return sx + DELTA;
        }

        const w = () => {
            if ((sx + NODE_HEIGHT) > tx) {
                return Math.max(10, sx - tx + (2 * DELTA));
            }
            return Math.max(10, tx - sx - (2 * DELTA));
        }


        const clickrectprops = {
            fill: 'transparent',

            x: xpos(),

            y: Math.min(sy, ty),

            width: w(),

            height: Math.abs(ty - sy),

            onClick: this.props.actions.linkSelected.bind(null, id),
        };



        const className = cx({
            'link_line': !(selectedId === id),
            'drag_line': (selectedId === id),
        });

        return <g>
            <rect {...clickrectprops} ></rect>
            <path className={className} d={path({ ...source, x: sx, y: sy }, sourcePort, { ...target, x: tx, y: ty })} />
        </g>
    }
}