import React from 'react';
import Modal from '../components/modal';
import Account from '../components/account';
import FlexModalWrapper from 'react-modal-wrapper';
import '../styles/core.scss';
import bee from '../../../assets/bee.png';
import twitter from '../../../assets/twitter.svg';

function CoreLayout({children}) {
  const topStyle = {
    padding: '15px 30px 15px 30px',
    marginBottom: 15,
    fontSize: '13px',
    position: 'absolute',
    zIndex: 100
  };
  const topRightStyle = {
    padding: '15px 30px 15px 30px',
    marginBottom: 15,
    fontSize: '13px',
    position: 'absolute',
    zIndex: 100,
    right: 0
  };
  const alpha = <div style={{color: 'darkred', marginTop: -5, marginLeft: 33}}><a href="#">beta</a></div>;
  return (
    <div className="page-container">
      <div style={topStyle}>
        <div style={{fontSize: '20px', marginRight: 20, fontWeight: 'bold'}}>Chess <img src={bee} style={{width: 25, height: 25, marginBottom: -4}} /></div>
        <FlexModalWrapper className="modal" closeOnEsc closeOnOutsideClick openByClickOn={alpha}>
          <Modal>
            <h2>ChessB Beta Version</h2>
            <ul>
              <li>we are so excited about this app that we released it asap</li>
              <li>there can be many bugs - <a href="mailto:info@chessb.com">let us know</a>!</li>
              <li>the server (games) can go suddenly down</li>
              <li><b>there are many new features in making</b></li>
              <li>any feedback welcomed, check our <a target="_blank" href="https://twitter.com/bugches">twitter</a></li>
            </ul>
          </Modal>
        </FlexModalWrapper>
        <div style={{marginTop: -2, marginLeft: 31}}><a href="https://en.wikipedia.org/wiki/Bughouse_chess" target="_blank">rules</a></div>
      </div>
      <div style={topRightStyle}>
        <Account />
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
