import { createStructuredSelector, createSelector } from 'reselect';

export const NAME = 'dpia';

const TOGGLE_DPIA = 'iot.red/dpia/TOGGLE_DPIA';

const initialState = {
    show: false,
    nid: null,
}

export default function reducer(state = initialState, action) {

    switch (action.type) {
        case TOGGLE_DPIA:
            return {
                ...state,
                show: !state.show,
                nid: state.show ? null : action.nid,
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

function toggleChecked(category, criteria) {

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

const upstream = (nid, links = {}) => {

    const parents = _inputs(nid, links);

    if (parents.length == 0)
        return [];

    return _dedup(parents.reduce((acc, parentnid) => {
        return [...acc, parentnid, ...(upstream(parentnid, links))];
    }, []));
}

const categories = createSelector([nid, links, nodes], (nid, links, nodes) => {
    if (nid) {
        const node = nodes[nid];
        const nodeinputs = _inputs(nid, links);

        const personaldata = nodeinputs.reduce((acc, nid) => {
            const node = nodes[nid];
            if (node.schema && node.schema.output && node.schema.output.ptype) {
                const ptype = node.schema.output.ptype;
                acc = [...acc, ...Object.keys(ptype).reduce((acc, key) => {
                    return [...acc, ...ptype[key]];
                }, [])]
            }
            return acc;
        }, []);

        console.log("personal data is ", personaldata);

        const upstreamnodes = upstream(node.id, links);
        const nature = [{ id: "sensitive" }, { id: "evaluation" }];
        const exported = [{ id: "automated" }, { id: "systematic" }, { id: "restriction" }, { id: "matching" }];
        const users = [{ id: "vulnerable" }];
    }
    return {}
});

export const selector = createStructuredSelector({
    show,
    categories,
});

export const actionCreators = {
    toggleDPIA,
    toggleChecked,
};