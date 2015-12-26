import React from 'react';
import {PIECES} from '../constants';
import {DragSource} from 'react-dnd';

import bishopb from '../assets/chess/bishopb.png';
import bishopw from '../assets/chess/bishopw.png';
import kingb from '../assets/chess/kingb.png';
import kingw from '../assets/chess/kingw.png';
import knightb from '../assets/chess/knightb.png';
import knightw from '../assets/chess/knightw.png';
import pawnb from '../assets/chess/pawnb.png';
import pawnw from '../assets/chess/pawnw.png';
import queenb from '../assets/chess/queenb.png';
import queenw from '../assets/chess/queenw.png';
import rookb from '../assets/chess/rookb.png';
import rookw from '../assets/chess/rookw.png';

const pieceSource = {
  beginDrag (props) {
    return {
      type: props.type,
      position: props.position
    };
  },

  canDrag (props) {
    return props.canDrag;
  }
};

function collect (connect, monitor) {
  return {
    connectDragSource: connect.dragSource(),
    isDragging: monitor.isDragging()
  };
}

class Piece extends React.Component {

  static propTypes = {
    type: React.PropTypes.string.isRequired,
    connectDragSource: React.PropTypes.func.isRequired,
    canDrag: React.PropTypes.bool.isRequired,
    overDrop: React.PropTypes.bool.isRequired,
    isDragging: React.PropTypes.bool.isRequired,
    isSelected: React.PropTypes.bool.isRequired,
    position: React.PropTypes.string.isRequired
  }

  render () {
    const squareStyle = {
      height: '100%',
      width: '100%',
      cursor: this.props.canDrag ? 'pointer' : 'default',
      border: (this.props.isSelected || this.props.overDrop) ? '3px solid black' : 'none'
    };
    const pieceStyle = {
      height: (this.props.isSelected || this.props.overDrop) ? '100%' : 'calc(100% - 6px)',
      width: (this.props.isSelected || this.props.overDrop) ? '100%' : 'calc(100% - 6px)',
      marginTop: (this.props.isSelected || this.props.overDrop) ? -3 : 0
    };
    return this.props.connectDragSource(
      <div style={squareStyle}>
        {!this.props.isDragging && <img src={getPic(this.props.type)} style={pieceStyle} draggable={this.props.canDrag} />}
      </div>
    );
  }
}

export default DragSource('piece', pieceSource, collect)(Piece);

function getPic (type) {
  if (type === PIECES.BISHOPB) return bishopb;
  if (type === PIECES.BISHOPW) return bishopw;
  if (type === PIECES.KINGB) return kingb;
  if (type === PIECES.KINGW) return kingw;
  if (type === PIECES.KNIGHTB) return knightb;
  if (type === PIECES.KNIGHTW) return knightw;
  if (type === PIECES.PAWNB) return pawnb;
  if (type === PIECES.PAWNW) return pawnw;
  if (type === PIECES.QUEENB) return queenb;
  if (type === PIECES.QUEENW) return queenw;
  if (type === PIECES.ROOKB) return rookb;
  if (type === PIECES.ROOKW) return rookw;
}
