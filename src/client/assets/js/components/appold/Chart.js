//import React, { Component } from 'react';
import cx from 'classnames';
import {TOPPADDING,BOTTOMPADDING,LEFTPADDING,RIGHTPADDING,CHARTXPADDING,CHARTYPADDING,TICKCOUNT,BARSPACING,YAXISVALUESIZE, AXISLABELSIZE} from '../../constants/ChartConstants';
import moment from 'moment';
import {textWidth} from '../../utils/utils';

const colours = ["#1f77b4","#ff7f0e","#2ca02c","#d62728","#9467bd","#8c564b","#e377c2","#7f7f7f","#bcbd22","#17becf"];
const lookup = [];

const _colourFor = (id)=>{
	let index = lookup.indexOf(id);

  	if (index === -1){
     	lookup.push(id);
     	index = lookup.length - 1;
  	}
	
  	return colours[index%colours.length];
}

class Chart extends React.Component {
	
	constructor(props){
		super(props);
	} 
	
	render() {
		
		let {w, h, config, data} = this.props;
		
		const titlebar = {
            height: 40,
            width: '100%',
            boxShadow: '0 3px 6px rgba(0,0,0,0.16), 0 3px 6px rgba(0,0,0,0.23)',
            background: '#445662',
            color: 'white',
            fontSize: '1.3em',
            lineHeight: '40px',
            textAlign: 'center',
        }
        
       
		
		return 	 <div>
					<div style={titlebar}>
						<div className="centered">{this.props.title}</div>
					</div>
					<div>
						<BarChart {...{w:w, h:h-40, config:config, data:data}} />
					</div>
				</div>
				
	}
};


class BarChart extends Component {
	
	render(){
	
		const {w, h, config, data} = this.props;
		
		if (data.length <= 0){
			return null;
		}
		
		console.log(data.length);
		console.log("data is");
		console.log(data);
		console.log("config is");
		console.log(config);
		
		const BARWIDTH = (w-LEFTPADDING-RIGHTPADDING-CHARTXPADDING)/data.length;
		const XAXISVALUESIZE = Math.min(16,BARWIDTH/2);
		//calculate the amount of bottom padding we need based on the max width of the x-axis labels
		const longestlabel = data.reduce((acc, obj)=>{
			if (obj.x){
				if (obj.x.length > acc.length){
					acc = obj.x;
				}
			}
			return acc;
		},""); 
		
		const BOTTOMPADDING = textWidth(longestlabel, {size:`${XAXISVALUESIZE}px`}) + CHARTYPADDING + 2;
		
		const CHARTHEIGHT = h - TOPPADDING - BOTTOMPADDING;
		const CHARTWIDTH  = w - LEFTPADDING - RIGHTPADDING;
		
		
		let MAX = data.reduce( (acc, item)=>{
		  return Math.max(acc, item.y);
		}, 0);

		let MIN = data.reduce( (acc, item)=>{
		  return Math.min(acc, item.y);
		}, Number.MAX_VALUE);

		if (MIN == MAX){
		   MIN = MAX-1;
		}

		const ORIGIN =  MIN < 0 ? 0 : MIN;
		let TICKDELTA = (MAX-MIN)/(TICKCOUNT);
		const RANGEMIN = MIN <= 0 ? MIN : MIN - TICKDELTA;
		const CLOSESTPOINTTOORIGIN = MAX - (Math.round(MAX/TICKDELTA) * TICKDELTA);

		console.log(`ORIGIN ${ORIGIN} CPTO: ${CLOSESTPOINTTOORIGIN} RANGEMIN:${RANGEMIN} TICKDELTA:${TICKDELTA} MAX:${MAX} MIN:${MIN}`);
		
		const yPos = (value)=>{
			const divisor = MAX-RANGEMIN;
			const yp = CHARTHEIGHT - ((value - RANGEMIN)  * (CHARTHEIGHT/divisor));
			console.log(`ypos for ${value} is ${yp}`);
			return yp;
		};

		const yPosAxis = (value)=>{ 
		   return yPos(value) - YAXISVALUESIZE/2;
		};

		const ylabels = [...Array(TICKCOUNT+2).fill(0)].map((v,tick)=>{

			  const value = RANGEMIN - CLOSESTPOINTTOORIGIN + (tick * TICKDELTA);

			  //prevent labels off chart
			  if (value >= MAX || value <= RANGEMIN)
				return null;

			  //prevent tick labels overlapping with max/min
			  const yPos = yPosAxis(value);   
	  
	  
			  if (yPos < YAXISVALUESIZE ||  (CHARTHEIGHT-yPos) < YAXISVALUESIZE)
				  return null;

		
			  const style = {
				position: 'absolute',
				left: -YAXISVALUESIZE*2,
				top:  yPos,        
				fontSize: YAXISVALUESIZE,
			  }
			  return <div key={tick} style={style}>{value.toFixed(1)}</div>
		});

		const zeroAxisprops = {
		  x1: CHARTXPADDING, 
		  x2: CHARTWIDTH,
		  y1: yPos(0),
		  y2: yPos(0),
		}

		const zeroAxisStyle = {
		  strokeWidth: '2px',
		  stroke: '#4d4d4d',
		}

		const axislinestyle = {
		  strokeWidth: '2px',
		  stroke: '#4d4d4d',
		}

		const xaxisprops = {
		  x1: CHARTXPADDING, 
		  x2: CHARTWIDTH,
		  y1: CHARTHEIGHT,
		  y2: CHARTHEIGHT,
		}

		const yaxisprops = {
		  x1: CHARTXPADDING,
		  x2: CHARTXPADDING,
		  y1: 0,
		  y2: CHARTHEIGHT,
		}

		const xaxis = <line style={axislinestyle} {...xaxisprops}/>
		const yaxis = <line style={axislinestyle} {...yaxisprops}/>
		const zeroAxis = <line style={zeroAxisStyle} {...zeroAxisprops}/>

		const xlabels = data.map((item,i)=>{
			  //const label = moment(item.x).format("HH:MM:ss");
			  const label = item.x;
			  
			  const style = {
				position: 'absolute',
				left:  CHARTXPADDING + ((i + 1) * BARWIDTH) - (BARWIDTH-XAXISVALUESIZE)/2,
				height: XAXISVALUESIZE + 1,
				width: BOTTOMPADDING,
				bottom: -XAXISVALUESIZE,
				transform: 'rotate(90deg)',
				transformOrigin: 'left top 0',
				fontSize: XAXISVALUESIZE,
				textAlign: 'left',
			  }

			  return <div key={item.x} key={i} style={style}>
						{label}
					 </div>
		});

		const linestyle = {
		  stroke: "#d4d4d4",
		  strokeWidth: '1px',
		  strokeOpacity: 0.5,
		}

		const ticks = [...Array(TICKCOUNT+1).fill(0)].map((v,tick)=>{

			const lineprops = {
			  x1: 0,
			  y1: yPos(Math.min(MAX, Math.min(MAX,(RANGEMIN - CLOSESTPOINTTOORIGIN) + ((tick)*TICKDELTA)))), 
			  x2: BARWIDTH * data.length,
			  y2: yPos(Math.min(MAX, Math.min(MAX,(RANGEMIN - CLOSESTPOINTTOORIGIN) + ((tick)*TICKDELTA)))), 
			} 
  
			return  <line key={tick+1} {...lineprops} style={linestyle}/>
		});

		const maxminlinestyle = {
		  stroke: "black",
		  strokeWidth: '2px',
		  strokeOpacity: 0.5,
		  strokeDasharray:"5,5"
		}

		const mintickprops = {
			  x1: 0,
			  y1: yPos(RANGEMIN), 
			  x2: BARWIDTH * data.length,
			  y2: yPos(RANGEMIN), 
		}

		const maxtickprops = {
			  x1: 0,
			  y1: yPos(MAX), 
			  x2: BARWIDTH * data.length,
			  y2: yPos(MAX), 
		}

		const mintick = <line {...mintickprops} style={maxminlinestyle}/>
		const maxtick = <line {...maxtickprops} style={maxminlinestyle}/>

		const readings = data.map((item, i)=>{
 

		  const style = {
			fill: _colourFor(item.id),
			fillOpacity: 0.7,
			stroke: _colourFor(item.id),
			strokeOpacity: 1.0,
			strokeWidth: '1px',
			//filter: 'url(#shadow)', //works with newer versions of react...
		  }
  
  			
		  const rectprops = {
								x: CHARTXPADDING + (BARWIDTH * i) + (BARSPACING/2),
								y: item.y > 0 ? yPos(item.y) : yPos(0), 
								width: Math.max(1,BARWIDTH - BARSPACING),
								height: Math.abs(yPos(Math.max(RANGEMIN,0))-yPos(item.y)),

							}
		  
		  return <rect key={`${item.id}${item.x}`} className="animated" style={style} {...rectprops} />
  
  

		});

		 const yLabelStyle = {
			  width: CHARTHEIGHT,
			  color: "#4d4d4d",
			  position: 'absolute',
			  left: 0,
			  bottom: BOTTOMPADDING + CHARTYPADDING,
			  transform: 'rotate(-90deg)',
			  transformOrigin: 'left top 0',
			  textAlign: 'center',
			  fontSize: AXISLABELSIZE,
		  }

		  const xLabelStyle = {
			  width: CHARTWIDTH,
			  color: "#4d4d4d",
			  position: 'absolute',
			  left: LEFTPADDING,
			  bottom: 10,
			  textAlign: 'center',
			  fontSize: AXISLABELSIZE,
		  }

		  const minstyle = {
			  position: 'absolute',
			  top: yPosAxis(RANGEMIN),
			  left: -YAXISVALUESIZE*2,
			  fontSize: YAXISVALUESIZE,
			  fontWeight: 'bold',
		  }

		  const maxstyle = {
			  position: 'absolute',
			   top: yPosAxis(MAX),
			  left: -YAXISVALUESIZE*2,
			  fontSize: YAXISVALUESIZE,
			  fontWeight: 'bold',
		  }

		  const ymin = <div style={minstyle}>{RANGEMIN.toFixed(1)}</div>
		  const ymax = <div style={maxstyle}>{MAX.toFixed(1)}</div>


      	  return (
            <div>
               
                <div style={yLabelStyle}>temperature (degrees celcius)</div>
                  <div style={xLabelStyle}>time (hh:mm:ss) </div>
                  <div style={{position:'absolute', top:TOPPADDING, left:LEFTPADDING}}>
                  {ymin}
                  {ymax}
                  {xlabels}
                  {ylabels}
                  <svg width={CHARTWIDTH} height={CHARTHEIGHT}>
                    <defs>
                       <filter id="shadow">
                          <feFlood
                             floodOpacity="0.498039"
                             floodColor="rgb(0,0,0)"
                             result="flood"
                              />
                          <feComposite
                             in="flood"
                             in2="SourceGraphic"
                             operator="in"
                             result="composite1"
                            />
                          <feGaussianBlur
                             in="composite1"
                             stdDeviation="1.4"
                             result="blur"
                             />
                          <feOffset
                             dx="1.5"
                             dy="2.85882e-15"
                             result="offset"
                             />
                          <feComposite
                             in="SourceGraphic"
                             in2="offset"
                             operator="over"
                             result="composite2"
                             />
                        </filter>
                    </defs>
                    <g>
                      {mintick}
                      {maxtick}
                      {ticks}
                      {readings}
                      {RANGEMIN > 0 && xaxis}
                      {yaxis}
                      {RANGEMIN < 0 && zeroAxis}
                    </g>
                  </svg>
                </div>
            </div>
		);	
	}
}

Chart.defaultProps = {
	data : {},	
};
 
export default Chart;