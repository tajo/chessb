import React from 'react';
import Modal from '../components/modal';
import FlexModalWrapper from 'react-modal-wrapper';
import '../styles/core.scss';
import bee from '../../../assets/bee.png';
import twitter from '../../../assets/twitter.svg';

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
  const topRightStyle = {
    padding: '15px 30px 15px 30px',
    marginBottom: 15,
    fontSize: '13px',
    position: 'absolute',
    right: 0
  };
  const alpha = <div style={{color: 'darkred', marginTop: -5, marginLeft: 27}}><a href="#">alpha</a></div>;
  return (
    <div className="page-container">
      <div style={topStyle}>
        <div style={{fontSize: '20px', marginRight: 20, fontWeight: 'bold'}}>Chess <img src={bee} style={{width: 25, height: 25, marginBottom: -4}} /></div>
        <FlexModalWrapper className="modal" closeOnEsc closeOnOutsideClick openByClickOn={alpha}>
          <Modal>
            <h2>ChessB Alpha Version</h2>
            <ul>
              <li>we are so excited about this app that we released it asap</li>
              <li>there can be many bugs - <a href="mailto:info@chessb.com">let us know</a>!</li>
              <li>the server (games) can go suddenly down</li>
              <li>user registration will be released with the beta version</li>
              <li>user scores are not kept yet</li>
              <li>history of games is not kept yet</li>
              <li>please, be patient until beta and stable versions are released</li>
              <li><b>there are many new features in making</b></li>
              <li>any feedback welcomed, check our <a target="_blank" href="https://twitter.com/bugches">twitter</a></li>
            </ul>
          </Modal>
        </FlexModalWrapper>
      </div>
      <div style={topRightStyle}>
        <a href="https://twitter.com/bugches" target="_blank" title="Follow us on twitter for news and feedback!">
          <img src={twitter} style={{width: 30, height: 30}} />
        </a>
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
