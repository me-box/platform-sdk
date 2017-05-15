import React, { PropTypes } from 'react';

if (process.env.NODE_ENV !== 'production') {
  const {whyDidYouUpdate} = require('why-did-you-update')
  //whyDidYouUpdate(React, { include: /^pure/, exclude: /^Connect/ })
  whyDidYouUpdate(React, { include: /^Workspace/})
}

const App = (props) => (
  <div className="page-container">
    {React.cloneElement({...props}.children, {...props})}
  </div>
);

App.propTypes = {
  children: PropTypes.element.isRequired
};

export default App;