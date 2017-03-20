function _codeforschema(prefix, schema){
	return `const {${Object.keys(schema).map(item=>`${item}:${prefix}_${item}`).join(",")}} = ${prefix};\n`;	
}

function _subschema(prefix, obj){
	if (obj){
	
		return Object.keys(obj).reduce((acc, key)=>{
			switch (obj[key].type){
				case "object":
					acc = [acc, _descriptionforobject(obj[key]), _codeforschema(`${prefix}_${key}`, obj[key].properties), _subschema(`${prefix}_${key}`, obj[key].properties)].join("");
					
		}
		return acc;	
	},"");
	}
	return "";
}

function _descriptionforobject({description}){
	return `\/\/${description}\n`;
}

function _tabsfordepth(depth){
	var str = "";
	for (var i = 0; i < depth; i++){
		str = str + "  ";
	}
	return str;
}

function _enumerate_properties(obj, depth){
	return `${_tabsfordepth(depth)}{
				${Object.keys(obj).reduce((acc, key, idx)=>{
					const item = obj[key];
					switch (item.type){
						case "object":
							acc = `${acc}\n${_tabsfordepth(1)}${_tabsfordepth(depth)}${key}:\n${_templateobject(item,depth+1)}`;
							break;
						default:
							acc = `${acc}\n${_tabsfordepth(1)}${_tabsfordepth(depth)}${key}:<${item.type}>,`;
					}
					return acc;
				},"")}\n${_tabsfordepth(depth)}}`.replace("\n", "");	
}

function _map_properties(arr, depth){
	return `${arr.map((item)=>{
		return `\n${_tabsfordepth(depth)}\/\/${item.description||""}\n${_templateobject(item, depth)}\n`;
	}).join("\n")}`;
}

function _templateobject(obj,depth){
	if (obj.properties){
		return _enumerate_properties(obj.properties, depth)
	}
	if (obj.oneOf){
		return _map_properties(obj.oneOf, depth);
	}
}

//creates the return object
function _codeForInput(data){
	switch (data.type){
		case "object":
	 		return `${_templateobject(data,0)}`
	}
}

//creates the var assignment
export function codeFromSchema(data, type){	
	if (type==="input"){
		return Object.keys(data).reduce((lines, key)=>{
		
			switch (data[key].type){
				case "object":
					lines.push(_descriptionforobject(data[key]));
					lines.push(_codeforschema("msg", data[key].properties));
					lines.push(_subschema(key, data[key].properties));
					break;
				
				default:
					lines.push(`const ${key}=msg.${key}`); 
			}	
			return lines;
		},[]).join("");	
	}
	else if (type==="output"){
		return `return ${_codeForInput(data)}`;
	}
}

