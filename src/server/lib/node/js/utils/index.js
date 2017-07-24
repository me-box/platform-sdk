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