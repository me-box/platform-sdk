import React from 'react';
import spinner from '../../style/images/spin.svg';
import className from 'classnames';
import Node from './Node';
import {PALETTE_WIDTH} from '../constants/ViewConstants';

class Palette extends React.Component {
	
    constructor(props){
        super(props);
        this._escapeNodeType = this._escapeNodeType.bind(this);
    }

    _escapeNodeType(nt) {
        return nt.replace(" ","_").replace(".","_").replace(":","_");
    }

    render() {
        
        let spinnerClassname = className({
            'palleteSpinner': true,
            'hide': this.props.types.length > 0,
        });

        //this should be categories, i.e. one level up!
        let categories = Object.keys(this.props.categories).map((key,i)=>{
            let nodes = this.props.categories[key].map((type,i)=>{
                let nodeprops = {
                    nt: type.name,
                    def: type.def,
                    key: type.name,
                    reducer: type.reducer,
                    handleDrop: this.props.dropNode,
                }
                return <Node key={`i${type}`} {...nodeprops}/>
            });
            
            let style = {
                paddingBottom: '15px',
                fontWeight: 'bold',
            }

            return (<div key={i}>
                        <div id="palette-container-events">
                            <div id="palette-header-events" style={style}>
                               <span>{key}</span>
                            </div>
                            {nodes}
                        </div>
                    </div>);
                    
        });

        let palettecontainerstyle={
            display: this.props.types.length > 0 ? 'block':'none',
            background: '#303030',
            color: 'white',
            letterSpacing: 1,
            WebkitFontSmoothing: 'antialiased',
            textRendering: 'optimizeLegibility',
            width: PALETTE_WIDTH,
        }

		return( 
			<div id="palette">
        		<img src={spinner} className={spinnerClassname}/>

        		<div id="palette-container" className="palette-scroll" style={palettecontainerstyle}>
                     {categories}
                </div>
        		<div id="palette-footer">
            		<a className="palette-button" id="palette-collapse-all" href="#">
            			<i className="fa fa-angle-double-up"></i>
            		</a>
            		<a className="palette-button" id="palette-expand-all" href="#">
            			<i className="fa fa-angle-double-down"></i>
            		</a>
        		</div>
    		</div>
		);
	}
}

export default Palette;