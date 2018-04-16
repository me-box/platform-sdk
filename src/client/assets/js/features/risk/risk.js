import { createStructuredSelector } from 'reselect';

export const NAME = 'risk';

const risks = (state) => {

	return Object.keys(state.nodes.nodesById).map(k=>{
		const node = state.nodes.nodesById[k];
		const details =  Object.keys(node._def.defaults).reduce((acc, key)=>{
        		acc[key]= node._def.defaults[key].value;
        		return acc;
     	},{});
		const {score=5, reason="no risk overvew provided"} = node._def.risk ? node._def.risk(details) : {};

		return	{
			icon: node._def.icon,
			color: node._def.color,
			score,
			reason,
		}
		
	}).filter(item=>item.score > 0);
}

const rating = (state) => {
	return Object.keys(state.nodes.nodesById).reduce((acc,k)=>{
		const node = state.nodes.nodesById[k];
		

		const {score=5} = node._def.risk ? node._def.risk(node.subtype) : {};
		return score > acc ? score : acc;
	},0);
}

export const selector = createStructuredSelector({
	risks,
	rating,
});