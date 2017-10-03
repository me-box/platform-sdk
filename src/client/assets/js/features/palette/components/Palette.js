import React, { Component } from 'react';
//import spinner from '../../../styles/images/spin.svg';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import className from 'classnames';
import Node from './Node';
import {PALETTE_WIDTH} from 'constants/ViewConstants';
import { actionCreators as paletteActions, selector } from '../';
import { actionCreators as nodeActions} from 'features/nodes/actions';
import {contextTypes} from 'utils/ReactDecorators';

@connect(selector, (dispatch) => {
  return{
     actions: {...bindActionCreators(paletteActions, dispatch), ...bindActionCreators(nodeActions, dispatch)},
  }
})
export default class Palette extends Component {
	
    constructor(props){
        super(props);
        this._escapeNodeType = this._escapeNodeType.bind(this);
    }

    componentDidMount(){
        this.props.actions.fetchNodes();
    }

    _escapeNodeType(nt) {
        return nt.replace(" ","_").replace(".","_").replace(":","_");
    }

    render() {
        
        const {store} = this.context;
        const {palette:{categories, types}} = this.props;
        
        const spinnerClassname = className({
            'palleteSpinner': true,
            'hide': types.length > 0,
        });

        //this should be categories, i.e. one level up!
        const _categories = Object.keys(categories).map((key,i)=>{
            const nodes = categories[key].map((node,i)=>{
                const nodeprops = {
                    nt: node.name,
                    def: node.def,
                    reducer: node.reducer,
                    handleDrop: this.props.actions.dropNode.bind(null, {component:node.component, nt:node.name, def:node.def, reducer:node.reducer}),
                }
                return <Node key={`i${node.name}`} {...nodeprops}/>
            });
            
            const style = {
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

        const palettecontainerstyle={
            display: types.length > 0 ? 'block':'none',
            background: '#303030',
            color: 'white',
            letterSpacing: 1,
            WebkitFontSmoothing: 'antialiased',
            textRendering: 'optimizeLegibility',
            width: PALETTE_WIDTH,
        }

        /*
        <div id="palette-footer">
                    <a className="palette-button" id="palette-collapse-all" href="#">
                        <i className="fa fa-angle-double-up"></i>
                    </a>
                    <a className="palette-button" id="palette-expand-all" href="#">
                        <i className="fa fa-angle-double-down"></i>
                    </a>
                </div>*/
		return( 
			<div id="palette">
        		<img src={""} className={spinnerClassname}/>

        		<div id="palette-container" className="palette-scroll" style={palettecontainerstyle}>
                     {_categories}
                </div>
        		
    		</div>
		);
	}
}