import React, { Component } from 'react';
import { LINE_CURVE_SCALE, OUTPUT_WIDTH, OUTPUT_GAP } from 'constants/ViewConstants';
import { actionCreators as linkActions, selector } from 'features/ports';
import { actionCreators as dpiaActions } from 'features/dpia';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';


const _colours = {
    "i": "#3771c8",
    "p": "#E65100",
    "s": "#B71C1C",
}

const _ordinals = {
    "primary": 1,
    "secondary": 2,
}

const warnings = ["export"];

const warn = (target) => {
    return warnings.indexOf(target.type) != -1;
}

const _range = (arr) => {
    if (arr.length <= 0) {
        return {
            min: -1,
            max: -1,
        }
    }

    return arr.reduce((acc, item) => {
        if (acc.min > item) {
            acc.min = item;
        }
        if (acc.max < item) {
            acc.max = item;
        }
        return acc;
    }, { min: 1, max: 0 })
}

const _opacity = (status = []) => {

    if (status.indexOf("inferable") != -1 && status.indexOf("inferred") == -1) {
        return 0.4;
    }
    return 1.0;
}

@connect(selector, (dispatch) => {
    return {
        actions: { ...bindActionCreators({ ...linkActions, ...dpiaActions }, dispatch) },
    }
})


export default class Badge extends Component {

    constructor(props) {
        super(props);
        this.renderBadge = this.renderBadge.bind(this);
        this.renderAccuracy = this.renderAccuracy.bind(this);
        this.state = { showdpia: false };
    }

    renderRange(min, max, ex, ey) {
        const accuracystyle = {
            stroke: "#fff",
            strokeWidth: 2,
            fill: min < 0.5 ? "#d40000" : "#33923F",
        }
        const textprops = {
            x: ex,
            y: ey + 3,

        }

        const accuracy = min == max ? min : `${min} - ${max}`;
        const w = min === max ? 30 : 50;

        return <g>
            <rect x={ex - w / 2} y={ey - 10} width={w} height={20} style={accuracystyle}>{accuracy}</rect>
            <text className="accuracy" {...textprops}>{accuracy}</text>
        </g>
    }

    renderAccuracy(type, coords) {
        const { sx, sy, ex, ey } = coords;

        const linestyle = {
            stroke: "#888",
            strokeWidth: 2,
        }

        const { min, max } = _range(type.accuracy);

        if (min > -1 && max > -1) {

            return <g>
                <line x1={sx} y1={sy} x2={ex} y2={ey} style={linestyle} />
                {this.renderRange(min, max, ex, ey)}
            </g>

        }
        return null;
    }

    renderBadge() {

        const { id, link: { source, target, sourcePort = 0 }, cpos = {} } = this.props;

        const { x: sx, y: sy } = cpos[source.id] || { x: source.x, y: source.y };
        const { x: tx, y: ty } = cpos[target.id] || { x: target.x, y: target.y };

        const onClick = () => { this.props.actions.linkSelected(id) }



        const ptype = source.schema && source.schema.output && source.schema.output.ptype ? source.schema.output.ptype : [];


        if (Object.keys(ptype || {}).length <= 0) {
            return null;
        }


        const _t = Object.keys(ptype || {}).reduce((acc, key) => {

            const item = ptype[key] || [];

            return item.reduce((acc, item) => {

                const ordinalnum = _ordinals[item.ordinal] || -1;

                let val = acc[item.type] || { ordinals: [], accuracy: [], status: [] }


                if (val.ordinals.indexOf(ordinalnum) == -1) {
                    acc[item.type] = {
                        ...val,
                        ordinals: [...val.ordinals, ordinalnum],
                    }
                }

                if (item.accuracy && item.status != "inferable") {
                    acc[item.type] = {
                        ...acc[item.type],
                        accuracy: [...val.accuracy, item.accuracy]
                    }
                }

                if (item.status) {
                    acc[item.type] = {
                        ...acc[item.type],
                        status: [...val.status, item.status]
                    }
                }
                return acc;
            }, acc);
        }, {});



        const ordinals = Object.keys(_t).reduce((acc, key) => {
            const ordinalarray = _t[key].ordinals;
            const accuracy = _t[key].accuracy;
            const status = _t[key].status;
            if (ordinalarray.length == 1) {
                acc[key] = {
                    ordinal: ordinalarray[0],
                    accuracy,
                    status,
                }
            } else {
                acc[key] = {
                    ordinal: "*",
                    accuracy,
                    status,
                }
            }
            return acc;
        }, {});

        const types = Object.keys(ordinals).map((key) => {
            const suffix = ordinals[key].ordinal;
            const type = {
                type: `${key[0]}${suffix}`,
                accuracy: ordinals[key].accuracy,
                status: ordinals[key].status,
            }
            return type;
        })

        const outputradius = OUTPUT_WIDTH / 2;
        const numOutputs = source.outputs || 1;
        //const sourcePort = sport || 0;
        const portY = -((numOutputs - 1) / 2) * OUTPUT_GAP + OUTPUT_GAP * sourcePort;

        const dy = ty - (sy + portY);
        const dx = tx - (sx + source.w);

        let scale = LINE_CURVE_SCALE;

        if (dx < 0) {
            scale += 2 * (Math.min(outputradius * source.w, Math.abs(dx)) / (outputradius * source.w));
        }

        const x1 = sx + (source.w / 2) + outputradius;
        const x2 = tx - (target.w / 2) - outputradius;
        const y1 = sy;
        const y2 = ty;

        const _r = 10;
        const _center_r = warn(target) ? _r : _r;

        const _cx1 = x1 + (source.w * scale);
        const _cx2 = x2 - scale * source.w;
        const _cy1 = y1 + portY;
        const _cy2 = y2;
        const _cx = _cx1 + (_cx2 - _cx1) / 2
        const _cy = _cy2 - (_cy2 - _cy1) / 2



        const privateicon = '\uf06e';
        const gap = 2;
        const delta = (_r * (types.length - 1)) + (gap * types.length);

        const theta = 120 * Math.PI / 180;

        const circlecenterstyle = {
            stroke: warn(target) ? "none" : "#fff",
            strokeWidth: 2,
            fill: warn(target) ? "white" : "#ddd"
        }

        const linestyle = {
            stroke: "#888",
            strokeWidth: 2,
        }

        const circles = types.map((t, i) => {



            const _dcx = 25 * Math.sin(theta * i);
            const _dcy = 25 * Math.cos(theta * i);

            const _acx = (i == 0 ? 50 : 70) * Math.sin(theta * i);
            const _acy = (i == 0 ? 50 : 70) * Math.cos(theta * i);
            //const _dcy = _cy-delta + (i * 2 * _r) + ((i+1)*gap) + gap/2

            const textprops = {
                x: _cx + _dcx,
                y: _cy + _dcy + 3,

            }


            const opacitystyle = {
                opacity: _opacity(t.status),
            }

            const circlestyle = {
                stroke: "#fff",
                strokeWidth: 2,
                fill: _colours[t.type[0]],
            }

            return <g onClick={onClick} style={opacitystyle}>
                {this.renderAccuracy(t, { sx: _cx + _dcx, sy: _cy + _dcy + _r, ex: _cx + _acx, ey: _cy + _acy })}
                <line x1={_cx} y1={_cy} x2={_cx + _dcx} y2={_cy + _dcy - _r} style={linestyle} />
                <circle cx={_cx + _dcx} cy={_cy + _dcy} r={_r} style={circlestyle} />
                <text className="badge" {...textprops}>{t.type}</text>
            </g>
        });

        const warningprops = {
            x: _cx,
            y: _cy + 4,
            fill: "white",
            fontWeight: "bold"
        }
        const icontxt = '\uf06a'

        return <g>
            {circles}
            {circles.length > 0 && <circle cx={_cx} cy={_cy} r={_center_r / 2} style={circlecenterstyle} />}
            {circles.length > 0 && warn(target) && <text onClick={(e) => this.props.actions.toggleDPIA(target.id)} className="warning" {...warningprops}>{icontxt}</text>}

        </g>

    }


    render() {
        return this.renderBadge();

    }
}