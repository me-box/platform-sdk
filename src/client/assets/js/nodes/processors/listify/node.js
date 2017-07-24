import React from 'react';
import Textfield from 'components/form/Textfield';

import {configNode} from 'utils/ReactDecorators';

@configNode()
export default class Node extends React.Component {

       render() {
          const {values,updateNode} = this.props;
          
          const nameprops = {
              id: "name",
              value: values.name || "",
              onChange: (property, event)=>{
                  updateNode(property, event.target.value);
              },
          }
          
          return <div className="flexcolumn">
          				<div>
          					<div className="flexrow">
								<div className="title">	
									<div className="centered">name</div>
								</div>
					
								<div>
									<div className="centered">
										<Textfield {...nameprops}/>
									</div>
								</div>
							</div>
						</div>
					</div>			
          
       }
}
