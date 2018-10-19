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

        const datastores = Object.keys(nodes).reduce((acc, key) => {
            const n = nodes[key];
            console.log("n is", n);

            if (n._def && n._def.category === "datastores") {
                acc = [...acc, n];
            }
            return acc;
        }, []);

        const personaldata = datastores.reduce((acc, n) => {
            console.log("n is", n);
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

        const personaldescription = `Your app uses ${datastores.length} data sources which emit ${pdatastr.join(" and ")} `;
        console.log(personaldescription);


        console.log("personal data is ", personaldata);

        const upstreamnodes = upstream(node.id, links);
        const nature = Object.keys(datastores).length > 0 ? [{ id: "personal", description: "" }, { id: "evaluation" }] : [];
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