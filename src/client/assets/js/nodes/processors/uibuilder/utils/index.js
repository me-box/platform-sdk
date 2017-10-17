import {spring} from 'react-motion';

function _group_schema(){
	return {
		attributes:{
			x: {type:"number", description:"x translate"},
			y: {type:"number", description:"y translate"},
			width:{type:"number", description:"bounding box width of group"},
			height: {type:"number", description:"bounding box height of group"},
		},
		style:{
			fill: 	{type:"colour", description:"fill colour"},
			stroke: {type:"colour", description:"stroke colour"},
			"stroke-width": {type:"number", description:"stroke width"},
			opacity: {type:"number", description:"opacity from 0 (transparent) to 1 (opaque)"},
		}
	}
}

function _circle_schema(){
	return {
		
		attributes:{
			cx: {type:"number", description:"x coordinate of circle center"},
			cy: {type:"number", description:"y coordinate of circle center"},
			r: {type:"number", description:"circle radius (px)"},
		},
		
		style:{
			fill: 	{type:"colour", description:"fill colour"},
			stroke: {type:"colour", description:"stroke colour"},
			"stroke-width": {type:"number", description:"stroke width"},
			opacity: {type:"number", description:"opacity from 0 (transparent) to 1 (opaque)"},
		}
	}
}


function _ellipse_schema(){
	return {
		
		attributes:{
			cx: {type:"number", description:"x coordinate of circle center"},
			cy: {type:"number", description:"y coordinate of circle center"},
			rx: {type:"number", description:"circle x radius (px)"},
			ry: {type:"number", description:"circle y radius (px)"},
		},
		
		style:{
			fill: 	{type:"colour", description:"fill colour"},
			stroke: {type:"colour", description:"stroke colour"},
			"stroke-width": {type:"number", description:"stroke width"},
			opacity: {type:"number", description:"opacity from 0 (transparent) to 1 (opaque)"},
		}
	}
}


function _line_schema(){
	return {
		
		attributes:{
			x1: {type:"number", description:"x coordinate of first point"},
			x2: {type:"number", description:"x coordinate of last point"},
			y1: {type:"number", description:"y coordinate of first point"},
			y2: {type:"number", description:"y coordinate of last point"},
		},
		
		style:{
			fill: 	{type:"colour", description:"fill colour"},
			stroke: {type:"colour", description:"stroke colour"},
			"stroke-width": {type:"number", description:"stroke width"},
			opacity: {type:"number", description:"opacity from 0 (transparent) to 1 (opaque)"},
		}
	}
}

function _path_schema(){
	return {
		
		attributes:{
			d: {type:"string", description:"svg path string"},
		},
		
		style:{
			fill: 	{type:"colour", description:"fill colour"},
			stroke: {type:"colour", description:"stroke colour"},
			"stroke-width": {type:"number", description:"stroke width"},
			opacity: {type:"number", description:"opacity from 0 (transparent) to 1 (opaque)"},
		}
	}
}

function _rect_schema(){
	return {
		
		attributes:{
			x: {type:"number", description:"x coordinate of left most position of the rect"},
			y: {type:"number", description:"y coordinate of top most position of the rect"},
			rx: {type:"number", description:"rx rounding"},
			ry: {type:"number", description:"ry rounding"},
			width: {type:"number", description:"rect width"},
			height: {type:"number", description:"rect height"},
		},
		
		style:{
			fill: 	{type:"colour", description:"fill colour"},
			stroke: {type:"colour", description:"stroke colour"},
			"stroke-width": {type:"number", description:"stroke width"},
			opacity: {type:"number", description:"opacity from 0 (transparent) to 1 (opaque)"},
		}
	}
}

function _text_schema(){
	return {
		
		attributes:{
			x: {type:"number", description:"x coordinate of left most position of the text"},
			y: {type:"number", description:"y coordinate text baseline"},
			text: {type:"string", description:"the text"},
		},
		
		style:{
			fill: 	{type:"colour", description:"fill colour"},
			stroke: {type:"colour", description:"stroke colour"},
			"stroke-width": {type:"number", description:"stroke width"},
			opacity: {type:"number", description:"opacity from 0 (transparent) to 1 (opaque)"},
			"text-decoration": {type:"enum", description: "text decoration", enum:["none", "underline", "overline", "line-through"]},
			"font-weight": {type:"enum", description:"font weight", enum:["normal","bold","bolder","lighter"]},
			"font-size":{type:"number", description:"size of the text (px)"},
			"font-style":{type:"enum", description:"font style", enum:["normal","italic","oblique"]},
			font:{type:"string", description:"font", enum:["Futura", "Arial", "Times New Roman"]},
			'font-family': {type:"enum", description:"font", enum:[`Arial, Helvetica, sans-serif`, 
																	`"Arial Black", Gadget, sans-serif`, 
																	`"Comic Sans MS", cursive, sans-serif`,
																	`"Courier New", Courier, monospace`, 
																	`Impact, Charcoal, sans-serif`,
																	`"Lucida Console", Monaco, monospace`,
																	`"Lucida Sans Unicode", "Lucida Grande", sans-serif`, 
																	`Tahoma, Geneva, sans-serif`, 
																	`"Times New Roman",Times,serif`, 
																	`"Trebuchet MS", Helvetica, sans-serif`, 
																	`"Palatino Linotype", "Book Antiqua", Palatino, serif`, 
																	`Verdana, Geneva, sans-serif`]}
		}
	}
}



function _circle(x:number,y:number){
	const id =generateId();
	return {
		id,
		label: `circle:${id}`,
		type: "circle",
		cx: x,
		cy: y,
		r: 50,
		style:{
			fill:'white',
			stroke: 'black',
			'stroke-width': 1,
			opacity: 1,
		}
	}
}

function _ellipse(x:number,y:number){
	const id =generateId();
	return {
		id,
		label: `ellipse:${id}`,
		type: "ellipse",
		cx: x,
		cy: y,
		rx: 40,
		ry: 60,
		style:{
			fill:'white',
			stroke: 'black',
			'stroke-width': 1,
			opacity: 1,
		}
	}
}

function _line(x:number,y:number){
	const id =generateId();
	return {
		id,
		label: `line:${id}`,
		type: "line",
		x1: x,
		x2: x + 30,
		y1: y,
		y2: y,
		style:{
			fill:'none',
			stroke: 'black',
			'stroke-width': 1,
			opacity: 1,
		}
	}
}

function _rect(x:number,y:number){
	const id =generateId();
	return {
		id,
		label: `rect:${id}`,
		type: "rect",
		x: x,
		y: y,
		rx: 5,
		ry: 5,
		width: 60,
		height: 40,
		style:{
			fill:'white',
			stroke: 'black',
			'stroke-width': 1,
			opacity: 1,
		}
	}
}

function _path(x:number,y:number){
	const id =generateId();
	return {
		id,
		label: `path:${id}`,
		type: "path",
		d: `M ${x} ${y} ${x+100} ${y+50}`,
		style:{
			fill:'black',
			stroke: 'black',
			'stroke-width': 2,
			opacity: 1,
		}
	}
}

function _text(x:number, y:number){
	const id =generateId();
	return {
		id,
		label: `text:${id}`,
		type: "text",
		x: x,
		y: y,
		text: "your text",
		style:{
			fill:'black',
			stroke: 'none',
			'stroke-width': 1,
			opacity: 1,
			'text-decoration': 'none',
			'font-weight': 'normal',
			'font-size': 30,
			'font-style': 'normal',
			'font-family': 'impact, georgia, times, serif'
		}
	}
}

function _group(x:number, y:number, children){
	const id =generateId();

	const bounds = calculateBounds(children, Number.MAX_VALUE, -1, Number.MAX_VALUE, -1);
	
	return {
		id,
		label: `group:${id}`,
		type: "group",
		x: x,
		y: y,
		width: bounds.width,
		height: bounds.height,
		children,
		style:{
			fill: 'none',
			stroke: 'none',
			opacity: 1,
			'stroke-width': 0,
		}
	}
}


function _strokewidth(str=""){
	return Math.round(`${str}`.replace("px", ""));
}

const commands = ['M','m','L','l', 'H', 'h', 'V', 'v', 'C', 'c','S', 's', 'Q', 'q', 'T', 't', 'A', 'a', 'Z', 'z'];

export function convertToJson(nodeList){
    
    const items = {};
   
  
    for (var item of nodeList){
      const id = generateId();
      
     

      switch(item.nodeName){
      
        case "g":

          const children = convertToJson(item.childNodes);
          
          const bounds = calculateBounds(children, Number.MAX_VALUE, -1, Number.MAX_VALUE, -1);
   
          items[id] = {

            id,
            type: "group",
            label: `group:${id}`,
            x: 0,
            y: 0,
            width: bounds.width,
            height: bounds.height,
            style:{
              fill: item.style.fill,
              stroke: item.style.stroke,
              'stroke-width': item.style.strokeWidth.trim() === "" ? 0: item.style.strokeWidth,
              opacity: 1,
            },
            children
          }

          break;

        case "ellipse":
          
          items[id] = {
            id,
            type: "ellipse", 
            label: `ellipse:${id}`,
            cx: item.cx.baseVal.value,
            cy: item.cy.baseVal.value,
            rx: item.rx.baseVal.value,
            ry: item.ry.baseVal.value,
            style:{
                fill: item.style.fill,
                stroke: item.style.stroke.trim() === "" ? "none" :  item.style.stroke,
                'stroke-width': item.style.strokeWidth.trim() === "" ? 0: item.style.strokeWidth,
                opacity: 1,
            }
          };

          break;
        
        case "circle":
      
          items[id] = {
            id,
            label: `circle:${id}`,
            type: "circle", 
            cx: item.cx.baseVal.value,
            cy: item.cy.baseVal.value,
            r: item.r.baseVal.value,
            style:{
                fill: item.style.fill,
                stroke: item.style.stroke.trim() === "" ? "none" :  item.style.stroke,
                'stroke-width': item.style.strokeWidth.trim() === "" ? 0: item.style.strokeWidth,
                opacity: 1,
            }
          };
          break;
        
        case "rect":
          
          items[id] = {
            id,
            label: `rect:${id}`,
            type: "rect", 
            x: item.x.baseVal.value,
            y: item.y.baseVal.value,
            width: item.width.baseVal.value,
            height: item.height.baseVal.value,
            style:{
                fill: item.style.fill,
                stroke: item.style.stroke.trim() === "" ? "none" :  item.style.stroke,
                'stroke-width': item.style.strokeWidth.trim() === "" ? 0: item.style.strokeWidth,
                opacity: 1,
            }
          };

          break;
        
        case "line":
         
          items[id] = {
            id,
            label: `line:${id}`,
            type: "line", 
            x1: item.x1.baseVal.value,
            y1: item.y1.baseVal.value,
            x2: item.x2.baseVal.value,
            y2: item.y2.baseVal.value,
            style:{
                fill: item.style.fill,
                stroke: item.style.stroke.trim() === "" ? "none" :  item.style.stroke,
                'stroke-width': item.style.strokeWidth.trim() === "" ? 0: item.style.strokeWidth,
                opacity: 1,
            }
          };
          break;

        case "path":
       
          items[id]= {
            id,
            label: `path:${id}`,
            type: "path", 
            d: item.attributes.d.nodeValue.replace(/([MmLlHhVvCcSsQqTtAaZz])/g, ' $1 ').trim(),
            style:{
                fill: item.style.fill,
                stroke: item.style.stroke.trim() === "" ? "none" :  item.style.stroke,
                'stroke-width': item.style.strokeWidth.trim() === "" ? 0: item.style.strokeWidth,
                opacity: 1,
            }
          };
          break;

        case "text":
          
          items[id]= {
            id,
            label: `text:${id}`,
            type: "text", 
            x: item.x ? item.x.baseVal ? item.x.baseVal.value || 0 : 0 : 0,
            y: item.y ? item.y.baseVal ? item.y.baseVal.value || 0 : 0 : 0,
            text: item.text ? item.text.baseVal.value : "",
            style:{
                fill: item.style.fill,
                stroke: item.style.stroke.trim() === "" ? "none" :  item.style.stroke,
                'stroke-width': item.style.strokeWidth.trim() === "" ? 0: item.style.strokeWidth,
                opacity: 1,
            }
          };
          break;

      }
    }

    return items;
}

export function circleBounds(item){

  const sw = _strokewidth(item.style["stroke-width"]);
  return {
      x: item.cx- item.r,
      y: item.cy-item.r,
      width: item.r*2 + sw,
      height: item.r*2 + sw,
  }
}

export function lineBounds(item){
  return {
      x: Math.min(item.x1, item.x2),
      y: Math.min(item.y1, item.y2),
      width: Math.abs(item.x2 - item.x1),
      height: Math.abs(item.y2- item.y1)
  }
}

export function ellipseBounds(item){
	const sw = _strokewidth(item.style["stroke-width"]);
  return {
      x: item.cx - item.rx,
      y: item.cy - item.ry,
      width: item.rx*2 + sw,
      height: item.ry*2 + sw,
  }
}

export function rectBounds(item){
  
  return {
      x: item.x,
      y: item.y,
      width: item.width,
      height: item.height
  }
}

export function textBounds(item){
	

   return {
      x: item.x,
      y: item.y,
      width: 100,
      height: 12,
  }
}

export function pathBounds(item){

  var path = document.createElementNS("http://www.w3.org/2000/svg", 'path');
  path.setAttribute("d", item.d);
  const sw = _strokewidth(item.style["stroke-width"]);
  const pathLength = path.getTotalLength();
  const precision = 8;

  // linear scan for coarse approximation
  let miny = Number.MAX_VALUE;
  let minx = Number.MAX_VALUE;
  let maxx = -Number.MAX_VALUE;
  let maxy = -Number.MAX_VALUE;

  for (var scan, scanLength = 0, scanDistance; scanLength <= pathLength; scanLength += precision) {
    let point = path.getPointAtLength(scanLength);
    miny = Math.min(miny, point.y);
    minx = Math.min(minx, point.x);
    maxy = Math.max(maxy, point.y);
    maxx = Math.max(maxx, point.x);
  }


  return {x: minx, y: miny, width: (maxx-minx)+sw, height: (maxy-miny)+sw};
}


const _minMax = function(bounds, minmax){
	
	const {minX, maxX, minY, maxY} = minmax;

	return {
    		minX : Math.min(bounds.x, minX),
    		maxX : Math.max(bounds.x+bounds.width,maxX),
   	 		minY : Math.min(bounds.y, minY),
    		maxY : Math.max(bounds.y+bounds.height, maxY)
    }
}

export function calculateBounds(nodes, minX=Number.MAX_VALUE, maxX=-1, minY=Number.MAX_VALUE, maxY=-1){
 	

  const _minmax = Object.keys(nodes).reduce((acc, key)=>{
 
  		const item = nodes[key];
 		
  		const minmax = {
  							minX:acc.minX,
  							maxX:acc.maxX,
  							minY:acc.minY,
  							maxY:acc.maxY
  						};

 		switch(item.type){
        
	        case "group":
	          return _minMax(calculateBounds(item.children, acc.minX, acc.maxX, acc.minY, acc.maxY), minmax);

	        case "circle":
	          return _minMax(circleBounds(item), minmax);

	        case "ellipse":
	          return _minMax(ellipseBounds(item), minmax);

	        case "line":
	          return _minMax(lineBounds(item), minmax);
	         
	       case "path":
	       	  return _minMax(pathBounds(item), minmax);     

	        case "rect":
	          return _minMax(rectBounds(item), minmax);

	        case "text":
	          return _minMax(textBounds(item), minmax);
	          
	    }	

  },{minX:minX, minY:minY, maxX:maxX, maxY:maxY});


  return {
  	x:_minmax.minX,
  	y: _minmax.minY,
  	width: _minmax.maxX - _minmax.minX,
  	height: _minmax.maxY - _minmax.minY
  }
}



export function enumForPropery(type, property){
	const schema = schemaLookup(type);
	if (schema.attributes[property] && schema.attributes[property].enum){
		return schema.attributes[property].enum;
	}
	if (schema.style[property] && schema.style[property].enum){
		return schema.style[property].enum;
	}
			
	return [];
}

export function typeForProperty(type, property){
	
	const schema = schemaLookup(type);
	
	if (schema){
		if (schema.attributes[property])
			return schema.attributes[property].type;
		if (schema.style[property])
			return schema.style[property].type;
	}
	return "unknown";
}

export function schemaLookup(type){
	switch (type){
		case "line":
			return _line_schema();

		case "rect":
			return _rect_schema();

		case "circle":
			return _circle_schema();

		case "ellipse":
			return _ellipse_schema();

		case "text":
			return _text_schema();

		case "group":
			return _group_schema();

	    case "path":
	    	return _path_schema();

		default:
			return null;
	}
}

export function createTemplate(type:string, x:number, y:number){
	switch (type){
		case "line":
			return _line(x,y);

		case "rect":
			return _rect(x,y);

		case "circle":
			return _circle(x,y);
		
		case "ellipse":
			return _ellipse(x,y);

		case "text":
			return _text(x,y);

		case "path":
			return _path(x,y);

		default:
			return null;
	}
}


const _extracttemplates = (children)=>{
	return [].concat.apply([], Object.keys(children).reduce((acc, key)=>{
		const child = children[key];
		acc.push(child);
		if (child.children)
			acc.push(_extracttemplates(child.children))
		return acc;
	},[]));
}

export function createGroupTemplate(children, x:number, y:number){
		
	const id =generateId();

	const bounds = calculateBounds(children, Number.MAX_VALUE, -1, Number.MAX_VALUE, -1);
	
	const extracted = _extracttemplates(children).reduce((acc, template)=>{
		if (template.children){
			acc[template.id] = Object.assign({}, template, {children: Object.keys(template.children).map(k=>template.children[k].id)});
		}else{
			acc[template.id] = template;
		}
		return acc;
	},{});

	const template = {
		id : id,
		label: `group:${id}`,
		type: "group",
		x: x,
		y: y,
		width: bounds.width,
		height: bounds.height,
		children: Object.keys(children).map(k=>children[k].id),
		style:{
			fill: 'none',
			stroke: 'none',
			opacity: 1,
			'stroke-width': 0,	
		}
	}

	return {root: template, templates:extracted};
}

export function originForNode(node){

	switch (node.type){

		case "line":
			return {x:node.x1, y:node.y1}

		case "text":
			return {x:0, y:0}

		case "path":
			const {x,y,width,height} = pathBounds(node);
			return  {x:x+ width/2, y: y + height/2}
		
		case "rect":
		case "group":
			return {x:node.width/2, y:node.height/2}

		case "ellipse":
		case "circle":
			return {x:node.cx, y:node.cy}

		default:
			return null;
	}
}

export function scalePreservingOrigin(x,y,sf){
	//return `translate(${node.cx},${node.cy}) scale(${sf}) translate(${-node.cx},${-node.cy})`
	return `scale(${sf}),translate(${-(x - (x/sf))},${-(y - (y/sf))})`
}


export function camelCase(str){
  return str.replace(/(?:^\w|[A-Z]|\b\w|\s+)/g, function(match, index) {
    if (+match === 0) return ""; // or if (/\s+/.test(match)) for white spaces
    return index == 0 ? match.toLowerCase() : match.toUpperCase();
  }).replace(/[-_]+/g, "");
}

export function camelise(style){
	
	style = style || {};

	return Object.keys(style).reduce((acc,key)=>{
		acc[camelCase(key)] = style[key];
		return acc;
	},{});

}

export function interpolatedStyles(styles, types, style){

	return styles.filter(key=>types[key]==="number").filter(key=>style[key]).reduce((acc, key)=>{
			const n = Number(style[key]);
			if (!isNaN(n)){
				acc[key] = spring(n); 
			}
			return acc;
	},{});
}

export function componentsFromTransform(a)
{
	a = a.replace(/\s+/g,"");
    var b={};
    for (var i in a = a.match(/(\w+\((\-?\d+\.?\d*e?\-?\d*,?)+\))+/g))
    {
        var c = a[i].match(/[\w\.\-]+/g);
        b[c.shift()] = c;
    }
    
    return b;
}

export function templateForPath(path, templates)
{


  if (path.length <= 0){
    return null;
  }

  const [id, ...rest] = path;

  if (path.length == 1){
    return templates[id]
  }

  return templateForPath(rest, templates[id].children);
}

export function defaultCode(key, property){
   if (["scale", "rotate", "translate"].indexOf(property) !== -1){
      
      switch (property){
          case "scale":
            return `return \`scale(\${${key}%3})\`;`;

          case "rotate":
            return `return \`rotate(\${${key}%360})\``;

         default:
            return `return \`translate(\${${key}},\${${key}})\``;
      }
   }
   return `return ${key}`
}

export function resolvePath(key,path,obj){
	return path.reduce((acc,item)=>{
		return acc[item];
	},obj)[key];
}

export function generateId(){
	return (1+Math.random()*4294967295).toString(16);
}

export function generateIds(obj){
	return Object.keys(obj || {}).reduce((acc, key)=>{
		const id = generateId();
		const item = obj[key];
		if (item.children){
			acc[id] = Object.assign({}, item, {
													id,
													children: generateIds(item.children),
													label: `${item.type}:${id}`,
						});
		}else{
			acc[id] = Object.assign({}, item, {id,label: `${item.type}:${id}`});
		}
		return acc;
	},{})
}