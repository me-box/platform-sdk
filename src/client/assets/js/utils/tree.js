const _leaf= (id, links)=>{
	const item = links.find((item)=>{
		return item.split(":")[1] === id;
	});
	return item ? false : true;
}

//TODO: this only removes single node a->b->a  loops, not transtive a->b->c->a
//make recursive...

const _remove_loops=(links)=>{
	
	
	let seen = {};

	return links.reduce((acc, item)=>{
		 
		if (!seen[item]){ //(acc.find(i=>_from(i) === _to(item) && _to(i) === _from(item)))){
			acc = [...acc, item];
		}
		seen = {...seen, [item]:true}
		return acc;
	},[]);
}


const _children=(id, links, seen={})=>{
	
	if (seen[[id, ...links].join()]){
		return [id];
	}

	if (_leaf(id,links)){
		return [id];
	}

	seen[[id, ...links].join()] = true;

	return [id, ...links.filter((l)=>_from(l) === id).map(link=>[].concat(..._children(_to(link), links, seen)))];
}

const _from =(link)=>{
	return link.split(":")[1]
} 

const _to =(link)=>{
	return link.split(":")[2]
}

export function fromnode(link){
	return _from(link);
}

export function tonode(link){
	return _to(link);
}

export function downstreamnodes(id, links){
	return [].concat(..._children(id,links));// _remove_loops(links)));
}
