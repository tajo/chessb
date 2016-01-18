import React from 'react';
import {PIECES} from '../../common/constants';
import {DragSource} from 'react-dnd';
import Component from 'react-pure-render/component';

import bishopb from '../../../assets/chess/bishopb.png';
import bishopw from '../../../assets/chess/bishopw.png';
import kingb from '../../../assets/chess/kingb.png';
import kingw from '../../../assets/chess/kingw.png';
import knightb from '../../../assets/chess/knightb.png';
import knightw from '../../../assets/chess/knightw.png';
import pawnb from '../../../assets/chess/pawnb.png';
import pawnw from '../../../assets/chess/pawnw.png';
import queenb from '../../../assets/chess/queenb.png';
import queenw from '../../../assets/chess/queenw.png';
import rookb from '../../../assets/chess/rookb.png';
import rookw from '../../../assets/chess/rookw.png';

const pieceSource = {
  beginDrag(props) {
    return {
      type: props.type,
      position: props.position,
      board: props.board
    };
  },

  canDrag(props) {
    return props.canDrag;
  }
};

function collect(connect, monitor) {
  return {
    connectDragSource: connect.dragSource(),
    isDragging: monitor.isDragging()
  };
}

class Piece extends Component {

  static propTypes = {
    type: React.PropTypes.string.isRequired,
    connectDragSource: React.PropTypes.func.isRequired,
    canDrag: React.PropTypes.bool.isRequired,
    overDrop: React.PropTypes.bool,
    isDragging: React.PropTypes.bool.isRequired,
    isSelected: React.PropTypes.bool,
    position: React.PropTypes.string.isRequired,
    board: React.PropTypes.string.isRequired,
    count: React.PropTypes.number
  };

  render() {
    const squareStyle = {
      height: '100%',
      width: '100%',
      cursor: this.props.canDrag ? 'pointer' : 'default',
      border: (this.props.isSelected || this.props.overDrop) ? '2px dashed black' : 'none'
    };
    const pieceStyle = {
      height: (this.props.isSelected || this.props.overDrop) ? '100%' : 'calc(100% - 4px)',
      width: (this.props.isSelected || this.props.overDrop) ? '100%' : 'calc(100% - 4px)',
      marginTop: (this.props.isSelected || this.props.overDrop) ? -2 : 0,
      marginLeft: (this.props.isSelected || this.props.overDrop) ? 0 : 2
    };
    const indexStyle = {
      position: 'absolute',
      marginTop: -16,
      marginLeft: 3,
      fontSize: 13
    };
    const count = this.props.isDragging ? this.props.count - 1 : this.props.count;
    return (
      <div style={squareStyle}>
        {(!this.props.isDragging || this.props.count > 1) &&
          this.props.connectDragSource(
            <div>
              <img src={getPic(this.props.type)} style={pieceStyle} draggable={this.props.canDrag} />
            </div>
          )}
        {count > 1 && <div style={indexStyle}>{count}</div>}
      </div>
    );
  }
}

export default DragSource('piece', pieceSource, collect)(Piece);

function getPic(type) {
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
