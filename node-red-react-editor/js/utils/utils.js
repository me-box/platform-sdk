export function calculateTextWidth(str, className, offset) {
	
    let sp = document.createElement("span");
    sp.className = className;
    sp.style.position = "absolute";
    sp.style.top = "-1000px";
    sp.innerHTML = (str||"").replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;");
    document.body.appendChild(sp);
    const w = sp.offsetWidth;
    document.body.removeChild(sp);
    return offset+w;
}


export function range(start, stop, step) {
  // Optional parameters.
  if (arguments.length < 3) {
    step = 1;
    if (arguments.length < 2) {
      stop = start;
      start = 0;
    }
  }
  if ((stop - start) / step === Infinity) throw new Error("infinite range");
  
  let range = [];

  let kfn =  (x)=>{
  	var k = 1;
  	while (x * k % 1) k *= 10; // While number * magnitude is still a decimal, increase magnitude by factor of 10.
  	return k;
  };

  let k = kfn(Math.abs(step));

  //_range_integerScale(); // Used to prevent rounding errors.
  let i = -1;
  let j;
  start *= k, stop *= k, step *= k; // Scale up by magnitude to deal with integer steps (instead of floating point steps).
  if (step < 0) while ((j = start + step * ++i) > stop) range.push(j / k); // Scale back down.
  else while ((j = start + step * ++i) < stop) range.push(j / k);
  return range;
};

export function partial(fn /*, args...*/) {
	var slice = Array.prototype.slice;
	var args = slice.call(arguments, 1);
	return function() {
		return fn.apply(this, args.concat(slice.call(arguments, 0)));
	};
}

export function bindNodeIds(actionCreators, id){
  
  var keys = Object.keys(actionCreators)
  var boundActionCreators = {}
  for (var i = 0; i < keys.length; i++) {
    var key = keys[i]
    var actionCreator = actionCreators[key]
    if (typeof actionCreator === 'function') {
       boundActionCreators[key] = partial(actionCreator, id);
    }
  }
  return boundActionCreators
};

export function toggleItem(anarray, item){
	let newarray = Object.assign([], anarray);
	const index = newarray.indexOf(item);
	if (index != -1){
		newarray.splice(index,1);
	}else{
		newarray.push(item);
	}
  newarray.sort()
	return newarray;
}

//eg fontprop = "bold 13px Verdana";

export function textWidth(text, fontoptions) {
    var tag = document.createElement("div");
	fontoptions = fontoptions || {size: "12px"}
	//const fontProp = `${fontoptions.font} ${fontoptions.size}`;
    tag.style.position = "absolute";
    tag.style.left = "-999em";
    tag.style.whiteSpace = "nowrap";
    tag.style.fontSize = fontoptions.size;
    tag.innerHTML = text;
    document.body.appendChild(tag);
    const w = tag.clientWidth;
    document.body.removeChild(tag);
    return w;
}
