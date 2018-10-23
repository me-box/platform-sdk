import { createStructuredSelector, createSelector } from 'reselect';

export const NAME = 'dpia';

const TOGGLE_DPIA = 'iot.red/dpia/TOGGLE_DPIA';
const TOGGLE_CHECKED = 'iot.red/dpia/TOGGLE_CHECKED';

const initialState = {
    show: false,
    nid: null,
    checked: [],
}

export default function reducer(state = initialState, action) {

    switch (action.type) {
        case TOGGLE_DPIA:
            return {
                ...state,
                show: !state.show,
                nid: state.show ? null : action.nid,
            }

        case TOGGLE_CHECKED:
            return {
                ...state,
                checked: action.checked,
            }
        default:
            return state

    }
}

function toggleDPIA(nid = null) {
    return {
        type: TOGGLE_DPIA,
        nid: nid,
    }
}

function toggleChecked(criteria) {
    return (dispatch, getState) => {
        const currentlychecked = getState()[NAME].checked;
        const checked = currentlychecked.indexOf(criteria) == -1 ? [...currentlychecked, criteria] : currentlychecked.filter(c => c != criteria);

        dispatch({
            type: TOGGLE_CHECKED,
            checked,
        });
    }
}

const show = (state) => state[NAME].show;
const nid = (state) => state[NAME].nid;
const links = (state) => state.ports.linksById;
const nodes = (state) => state.nodes.nodesById;

const _dedup = (arrArg = []) => {
    return arrArg.filter((elem, pos, arr) => {
        return arr.indexOf(elem) == pos;
    });
}

const _inputs = (nid, links) => {
    return Object.keys(links).reduce((acc, key) => {
        const link = links[key];

        if (link && link.target && link.target.id === nid) {
            acc = [...acc, link.source.id];
        }
        return acc;
    }, [])
}

const _outputs = (nid, links) => {
    return Object.keys(links).reduce((acc, key) => {
        const link = links[key];

        if (link && link.source && link.source.id === nid) {
            acc = [...acc, link.target.id];
        }
        return acc;
    }, [])
}

const upstream = (nid, links = {}) => {

    const parents = _inputs(nid, links);

    if (parents.length == 0)
        return [];

    return _dedup(parents.reduce((acc, parentnid) => {
        return [...acc, parentnid, ...(upstream(parentnid, links))];
    }, []));
}


const path = (x1, x2, y1, y2) => {
    return `M ${x1} ${y1} C ${x1 + (20)} ${y1} ${x2 - 20} ${y2} ${x2} ${y2}`
}
const renderNode = (node, links, nodes) => {

    const inputs = _inputs(node, links).map(nid => {
        return nodes[nid].name || nodes[nid].label;
    });

    if (inputs.length == 0) {
        return null;
    }

    const outputs = _outputs(node, links).map(nid => {
        return nodes[nid].name || nodes[nid].label;
    })

    const iorigin = inputs.length <= 1 ? 20 : 0;
    const idelta = inputs.length <= 1 ? 0 : 40 / (inputs.length - 1);

    const inputlines = inputs.map((input, idx) => {
        return `<g>
                    <path d="${path(50, 80, iorigin + (idx * idelta), 20)}" style="stroke:#465662; stroke-width:2px; fill:none;"/>
                    <text style="font-size:0.8em; text-anchor:end; alignment-baseline:central" x=48 y=${iorigin + (idx * idelta)}>${input}</text>
                </g>`
    })

    const oorigin = outputs.length <= 1 ? 20 : 0;
    const odelta = outputs.length <= 1 ? 0 : 40 / (outputs.length - 1);

    const outputlines = outputs.map((output, idx) => {
        return `<g>
                    <path d="${path(120, 150, 20, oorigin + (idx * odelta))}" style="stroke:#465662; stroke-width:2px; fill:none;"/>
                    <text style="font-size:0.8em; text-anchor:start; alignment-baseline:central" x=150 y=${oorigin + (idx * odelta)}>${output}</text>
                </g>`
    })

    const icontxt = nodes[node]._def.unicode || '\uf040'

    return `<svg height="60" width="230">
                    <g transform="translate(20,10)">
                        ${inputlines}
                        <rect x=80 y=0 height=40 width=40 style="stroke:#EBEBEB; stroke-width:2px; fill:${nodes[node]._def.color};"/>
                        <text class="fa icon" x=100 y=20 style="text-anchor:middle;alignment-baseline:central">${icontxt}</text>
                        <circle cx=80 cy=20 r=5 style="stroke:#465662; stroke-width:2px; fill:white;"/>
                        ${outputlines}
                        <circle cx=120 cy=20 r=5 style="stroke:#465662; stroke-width:2px; fill:white;"/>
                    </g>
                
            </svg >`
}
const evaluationNodes = (upstream, links, nodes) => {

    const overview = upstream.filter(id => ["profilers", "processors"].indexOf(nodes[id]._def.category) != -1).reduce((acc, n) => {
        const rendered = renderNode(n, links, nodes);
        if (rendered) {
            acc = [...acc, `<div>${rendered}</div>`]
        }
        return acc;
    }, []);


    return `<div class="evaluation">
                <p>In the following nodes, <strong>personal data is being processed</strong> to generate an output. Please indicate whether any of the outputs below are used to evaluate or score, profile or predict the nature or behaviour of an app user."
                </p>
                ${overview.join("")}
            </div>`
}



const categories = createSelector([nid, links, nodes], (nid, links, nodes) => {
    if (nid) {
        const node = nodes[nid];
        const nodeinputs = _inputs(nid, links);

        const datastores = Object.keys(nodes).reduce((acc, key) => {
            const n = nodes[key];

            if (n._def && n._def.category === "datastores") {
                acc = [...acc, n];
            }
            return acc;
        }, []);

        const personaldata = datastores.reduce((acc, n) => {

            if (n._def && n._def.category === "datastores") {
                if (n.schema && n.schema.output && n.schema.output.ptype) {
                    const ptype = n.schema.output.ptype;

                    const ips = Object.keys(ptype).reduce((acc, key) => {
                        return ptype[key].reduce((acc, p) => {
                            acc[p.type] = [...(acc[p.type] || []), p.subtype || "true"];
                            return acc;
                        }, {});
                    }, {});

                    return {
                        personal: _dedup([...(acc.personal || []), ...(ips.personal || [])]),
                        sensitive: _dedup([...(acc.sensitive || []), ...(ips.sensitive || [])]),
                        identifier: _dedup([...(acc.identifier || []), ...(ips.identifier || [])]),
                    }
                }
            }
            return acc;
        }, {});

        const pdatastr = Object.keys(personaldata).reduce((acc, k) => {
            if (k === "identifier") {
                return [...acc, "identifier data"];
            }
            if (personaldata[k].length > 0) {
                return [...acc, `${k} data (${personaldata[k].join(",")})`]
            }
            return acc;
        }, []);

        const personaldescription = `<p>Your app uses <strong> ${datastores.length} </strong> data sources which emit <strong> ${pdatastr.join(" and ")}</strong>. Were this data exposed to third parties (either intentionally or accidentally), would it result in any serious impact on the app user's daily life or lead to any loss of rights or freedoms?   </p> `;
        const upstreamnodes = upstream(node.id, links);
        const enodes = evaluationNodes(upstreamnodes, links, nodes);

        const nature = Object.keys(datastores).length > 0 ? [
            { id: "personal", title: "Sensitive or personal data use", description: personaldescription },
            { id: "evaluation", title: "Evaluation/scoring", description: enodes },

        ] : [];

        const exported = [
            { id: "automated", title: "Automated decisions", description: "<p>Will any decisions be made, without human intervention, that may significantly affect the user (for example, legal decisions or access to services or resources, credit checks, loan applications, use of machine learning?</p>" },
            { id: "systematic", title: "Systematic monitoring/tracking", description: "<p>Will the data be used to monitor or track any aspect of a user or their behaviour (e.g. health data, location, occupancy, resource consumption)?</p>" },
            { id: "restriction", title: "Restriction of rights or access to a service / contract", description: "<p>Will the data be used to prevent or reduce access to a service or contract, or impinge upon a user's rights (e.g. freedom of speech, freedom of thought, freedom of movement, prohibition of discrimination, right to liberty, conscience and religion)?</p>" },
            { id: "matching", title: "Matching or combining datasets", description: "<p>Will the data be combined with data from other data processing operations, performed for different purposes and/or by different data controllers in a way that would exceed the reasonable expectations of the data subject?</p>" }
        ];

        const users = [
            { id: "vulnerable", title: "Typical user", description: "<p>Is your app aimed at children or vulnerable groups (e.g. the elderly, disabled, persecuted, health impaired)?" },
        ];

        return [
            {
                title: "nature of your data",
                description: "The type of data being collected will strongly influence the likelihood and severity of risk your app exposes a user to",
                values: nature,
            },
            {
                title: "data exported off the databox",
                description: "Your app is exporting data off the databox, which means that the user will relinquish control of this data.  There is an assumed elevated risk if it is used for any of the following:",
                values: exported,
            },
            {
                title: "intended user(s)",
                description: "Certain groups of user are deemed more vulnerable to risk, and will require an enhanced risk assessment",
                values: users,
            }
        ]
    }
});

const checked = (state) => state[NAME].checked;

const status = createSelector([checked], (checked) => {
    if (checked.length >= 2) {
        return "DPIA recommended";
    } else {
        return "DPIA not required";
    }
});

export const selector = createStructuredSelector({
    show,
    categories,
    checked,
    status,
});

export const actionCreators = {
    toggleDPIA,
    toggleChecked,
};