import { createStructuredSelector, createSelector } from 'reselect';

export const NAME = 'risk';

const nodesById = (state) => state.nodes.nodesById;

const risks = createSelector([nodesById], (nodesByID) => {

	return Object.keys(nodesById).map(k => {
		const node = nodesById[k];
		const details = Object.keys(node._def.defaults).reduce((acc, key) => {
			acc[key] = node._def.defaults[key].value;
			return acc;
		}, {});

		console.log("ok detauls are", details, "nopde is", node);

		const { score = 5, reason = "no risk overvew provided" } = node._def.risk ? node._def.risk(node.subtype || "") : {};

		return {
			icon: node._def.icon,
			color: node._def.color,
			score,
			reason,
		}

	}).filter(item => item.score > 0);
});

const rating = createSelector([nodesById], (nodesByID) => {
	return Object.keys(nodesById).reduce((acc, k) => {
		const node = nodesById[k];
		const { score = 5 } = node._def.risk ? node._def.risk(node.subtype) : {};
		return score > acc ? score : acc;
	}, 0);
});

export const selector = createStructuredSelector({
	risks,
	rating,
});