import React from 'react';
import '../styles/core.scss';
import bee from '../assets/bee.png';

// Note: Stateless/function components *will not* hot reload!
// react-transform *only* works on component classes.
//
// Since layouts rarely change, they are a good place to
// leverage React's new Statelesss Functions:
// https://facebook.github.io/react/docs/reusable-components.html#stateless-functions
//
// CoreLayout is a pure function of it's props, so we can
// define it with a plain javascript function...
function CoreLayout ({ children }) {
  const topStyle = {
    padding: '15px 30px 15px 30px',
    width: '100%',
    marginBottom: 15,
    fontSize: '15px'
  };
  return (
    <div className='page-container'>
      <div style={topStyle}>
        <span style={{fontSize: '20px', marginRight: 20, fontWeight: 'bold'}}>Chess <img src={bee} style={{width: 25, height: 25, marginBottom: -4}} /></span>
        <a style={{marginRight: 20}} href='https://en.wikipedia.org/wiki/Bughouse_chess'>Game rules</a>
        <a style={{marginRight: 20}} href='https://en.wikipedia.org/wiki/Bughouse_chess'>About</a>
      </div>
      <div className='view-container'>
        {children}
      </div>
    </div>
  );
}

CoreLayout.propTypes = {
  children: React.PropTypes.element
};

export default CoreLayout;
