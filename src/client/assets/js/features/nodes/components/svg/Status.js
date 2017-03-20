import React, { Component } from 'react';


export default class Status extends Component {

    constructor(props){
        super(props);
    }

    render(){

        const statusrectprops = {
            x: 6,
            y: 1,
            width: 9,
            height: 9,
            rx: 2,
            ry: 2,
            strokeWidth: 3,
        }

        const statuslabelprops = {
            x: 20,
            y: 9,
        }

        const status = <g className="node_status_group" style={{display:'none'}}> 
                            <rect {...statusrectprops}/>
                            <text {...statuslabelprops}/>
                      </g>


        const statuserrorimageprops = {
            xlinkHref: "icons/node-error.png",
            x: 0,
            y: -6,
            width: 10,
            height: 9,
        }

        const statuserrorimage = <image className="node_error hidden" {...statuserrorimageprops}/>


        const statuschangedimageprops = {
            xlinkHref: "icons/node-changed.png",
            x: 12,
            y: -6,
            width: 10,
            height: 10,
        }

        const statuschangedimage = <image className="node_changed hidden" {...statuschangedimageprops}/>

        return <g>
                    {status}
                    {statuserrorimage}
                    {statuschangedimage}
                </g>

    }

}
       
