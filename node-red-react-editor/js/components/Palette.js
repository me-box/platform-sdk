import React from 'react';
import spinner from '../../style/images/spin.svg';
import className from 'classnames';
import Node from './Node';

class Palette extends React.Component {
	
    constructor(props){
        super(props);
        this._escapeNodeType = this._escapeNodeType.bind(this);
    }

    _escapeNodeType(nt) {
        return nt.replace(" ","_").replace(".","_").replace(":","_");
    }

    render() {
	    
        console.log("ok have the props");
        console.log(this.props);

        let spinnerClassname = className({
            'palleteSpinner': true,
            'hide': this.props.types.length > 0,
        });

        //this should be categories, i.e. one level up!

        let nodes = this.props.types.map((type)=>{
            let nodeprops = {
                nt: type.name,
                def: type.def,
                key: type.name,
                handleDrop: this.props.dropNode,
            }
            return <Node {...nodeprops}/>
        });

        let palettecontainerstyle={
            display: this.props.types.length > 0 ? 'block':'none',
        }

		return( 
			<div id="palette">
        		<img src={spinner} className={spinnerClassname}/>

        		<div id="palette-search">
            		<i className="fa fa-search"></i>
            		<input id="palette-search-input" type="text" data-i18n="[placeholder]palette.filter"/>
            		<a href="#" id="palette-search-clear">
            			<i className="fa fa-times"></i>
            		</a>
        		</div>
        		<div id="palette-container" className="palette-scroll" style={palettecontainerstyle}>
                    {nodes}

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