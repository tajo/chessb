import React from 'react';
import '../styles/core.scss';
import bee from '../../../assets/bee.png';

// Note: Stateless/function components *will not* hot reload!
// react-transform *only* works on component classes.
//
// Since layouts rarely change, they are a good place to
// leverage React's new Statelesss Functions:
// https://facebook.github.io/react/docs/reusable-components.html#stateless-functions
//
// CoreLayout is a pure function of it's props, so we can
// define it with a plain javascript function...
function CoreLayout({children}) {
  const topStyle = {
    padding: '15px 30px 15px 30px',
    marginBottom: 15,
    fontSize: '13px',
    position: 'absolute'
  };
  return (
    <div className="page-container">
      <div style={topStyle}>
        <div style={{fontSize: '20px', marginRight: 20, fontWeight: 'bold'}}>Chess <img src={bee} style={{width: 25, height: 25, marginBottom: -4}} /></div>
        <div style={{color: 'darkred', marginTop: -5, marginLeft: 27}}>alpha</div>
      </div>
      <div className="view-container">
        {children}
      </div>
    </div>
  );
}

CoreLayout.propTypes = {
  children: React.PropTypes.element
};

export default CoreLayout;
