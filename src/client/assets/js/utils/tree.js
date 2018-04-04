const _leaf= (id, links)=>{
	const item = links.find((item)=>{
		return item.split(":")[1] === id;
	});
	return item ? false : true;
}

const _remove_loops=(links)=>{
	return links.reduce((acc, item)=>{
		if (!(acc.find(i=>_from(i) === _to(item) && _to(i) === _from(item)))){
			acc = [...acc, item];
		}
		return acc;
	},[]);
}

const _children=(id, links)=>{
	if (_leaf(id,links)){
		return [id];
	}
	return [id, ...links.filter((l)=>_from(l) === id).map(link=>[].concat(..._children(_to(link), links)))];
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
	return [].concat(..._children(id, _remove_loops(links)));
}
