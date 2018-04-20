export function fitText(text, style, requiredHeight, requiredWidth){
	let fontsize = requiredHeight-8; //adjust for padding
	
	let count = 0;
	
	const longestWord = text.split(" ").reduce((acc, txt)=>{
		if (acc.length < txt.length)
			return txt;
		return acc;
	}, " ");
	
	while (textWidth(longestWord, {...style, size: `${fontsize}px`}) > requiredWidth){
		fontsize -= 1;
	}
	
	return fontsize;
}

export function textWidth(text, fontoptions) {
	
    const tag = document.createElement("div");
	fontoptions = fontoptions || {size: "12px"}
	//const fontProp = `${fontoptions.font} ${fontoptions.size}`;
    tag.style.position = "absolute";
    tag.style.left = "-999em";
    tag.style.whiteSpace = "nowrap";
    tag.style.padding = fontoptions.padding || "0px";
    tag.style.fontSize = fontoptions.size;
    tag.innerHTML = text;
    document.body.appendChild(tag);
    const w = tag.clientWidth;
    document.body.removeChild(tag);
    return w;
}


export function _conditionsmet(conditions, ptypes){
    console.log("-->checking if ", conditions, "are met!");
    
    const compulsoryattributes =  conditions.reduce((acc,item)=>{
        return [...acc, ...item.attributes];
    },[]);
    console.log("compulory attributes", compulsoryattributes);

    const existingattributes = ptypes.map(i=>i.subtype);

    console.log("existingattributes", existingattributes);
    
    return compulsoryattributes.reduce((acc, item)=>{
        return acc && existingattributes.indexOf(item) != -1;
    },true);
};

export function _conditionstocheck(conditions){
    return conditions.filter(i=>i.type==="attribute");
}
//NB: if a node has inputs then we need to calculate whether certain items of personal data emerge as a result of the 
//fusion of the inputs.  We must first get the schema resulting from whatever the node does to the data, then check to see
//if there are any additional conditions that are satisified and so lead to new data items (for example, if one input has a subtype "gender")
//and another input has a condition that relies on "gender" then resolveconditions will find it, assuming that the node combines the tow data 
//items first.
export function resolveconditions(nid, schema={}){
    
    if (schema.output && schema.output.ptype){

          const ptype = schema.output.ptype;
                
          const result = { 
                    ...schema,
                    output: {
                        ...schema.output,
                        ptype: {

                            ...ptype,
                            [nid] : (ptype[nid] || []).filter((item)=>{
                   
                                if (!item.conditions || item.conditions.length <= 0) 
                                    return true

                                if (item.ordinal === "primary")
                                    return true;

                                const conditions = _conditionstocheck(item.conditions);

                                if  (conditions.length <= 0){
                                    return true;
                                }

                                return _conditionsmet(conditions, ptype[nid].filter(i=>i.ordinal==="primary" && i.type!="identifier"));
                            })
                        }
                    }
                }
            return result;
    }
    
    return schema;
};