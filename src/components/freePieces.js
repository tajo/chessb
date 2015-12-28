import React from 'react';
import {PIECES} from '../constants';
import Component from 'react-pure-render/component';
import Piece from './piece';

class FreePieces extends Component {

  static propTypes = {
    color: React.PropTypes.string.isRequired
  }

  render () {
    const rootStyle = {
      width: '17.5vw',
      height: '3.5vw',
      margin: '0px auto',
      zIndex: 100,
      display: 'flex',
      flexWrap: 'wrap'
    };

    const squareStyle = {
      width: '20%',
      height: '100%',
      cursor: 'pointer'
    };

    const indexStyle = {
      position: 'absolute',
      marginTop: -16,
      marginLeft: 3,
      fontSize: 13
    };
    return (
      <div style={rootStyle}>
        <div style={squareStyle}>
          <Piece type={PIECES.QUEENW} canDrag position='queen' />
          <div style={indexStyle}>2</div>
        </div>
        <div style={squareStyle}>
          <Piece type={PIECES.QUEENB} canDrag position='queen' />
          <div style={indexStyle}>2</div>
        </div>
      </div>
    );
  }
}

export default FreePieces;
