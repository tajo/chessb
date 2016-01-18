import React from 'react';
import Component from 'react-pure-render/component';
import Piece from './piece';
import {connect} from 'react-redux';
import {Record} from 'immutable';
import {actionCreators as gameActions} from '../redux/actions/game';
import {translatePieceReverse, isPieceMovebale, getFreePieces} from '../../common/chess';

const mapStateToProps = (state) => ({
  game: state.game
});

class FreePieces extends Component {

  static propTypes = {
    color: React.PropTypes.string.isRequired,
    board: React.PropTypes.string.isRequired,
    game: React.PropTypes.instanceOf(Record).isRequired,
    selectSquare: React.PropTypes.func.isRequired
  };

  render() {
    const freePieces = getFreePieces(this.props.game.getIn([this.props.board, 'engine']), this.props.color);
    const rootStyle = {
      width: `${freePieces.count() * 3.5}vw`,
      height: '3.5vw',
      margin: '0px auto',
      display: 'flex',
      flexWrap: 'wrap'
    };

    const squareStyle = {
      width: `${100 / freePieces.count()}%`,
      height: '100%',
      cursor: 'pointer'
    };

    return (
      <div style={rootStyle}>
        {freePieces.valueSeq().map((piece) => {
          const position = translatePieceReverse(piece.get('type')).type;
          const color = translatePieceReverse(piece.get('type')).color;
          return (
            <div key={position + color} style={squareStyle} onClick={() => this.handleClick(position, piece.get('type'))}>
              <Piece
                type={piece.get('type')}
                canDrag={isPieceMovebale(this.props.game.getIn([this.props.board, 'engine']), position) && this.props.game.getIn([this.props.board, 'engine']).turn === color}
                position={translatePieceReverse(piece.get('type')).type}
                board={this.props.board}
                count={piece.get('count')}
                isSelected={this.props.game.getIn([this.props.board, 'squareSelected', 'position']) === position &&
                  this.props.game.getIn([this.props.board, 'squareSelected', 'piece']) === piece.get('type')}
              />
            </div>
          );
        })}
      </div>
    );
  }

  handleClick(position, piece) {
    let passPosition = position;
    if (this.props.game.getIn([this.props.board, 'squareSelected', 'position']) === position) {
      passPosition = null;
    }
    if (isPieceMovebale(this.props.game.getIn([this.props.board, 'engine']), position)) {
      this.props.selectSquare(this.props.board, passPosition, piece);
    }
  }

}

export default connect(mapStateToProps, gameActions)(FreePieces);
