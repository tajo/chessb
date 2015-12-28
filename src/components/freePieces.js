import React from 'react';
import Component from 'react-pure-render/component';
import Piece from './piece';
import {connect} from 'react-redux';
import {Record} from 'immutable';
import {filterFreePieces, translatePieceReverse, isPieceMovebale} from '../lib/chess';

const mapStateToProps = (state) => ({
  game: state.game
});

class FreePieces extends Component {

  static propTypes = {
    color: React.PropTypes.string.isRequired,
    board: React.PropTypes.string.isRequired,
    game: React.PropTypes.instanceOf(Record).isRequired
  }

  render () {
    const freePieces = filterFreePieces(this.props.game.getIn([this.props.board, 'freePieces']), this.props.color);
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
        {freePieces.map((count, piece) => {
          return (
            <div style={squareStyle}>
              <Piece type={piece}
                     canDrag={isPieceMovebale(this.props.game.getIn([this.props.board, 'engine']), translatePieceReverse(piece).type)}
                     position={translatePieceReverse(piece).type}
                     board={this.props.board}
                     count={count}
              />
            </div>
          );
        })}
      </div>
    );
  }
}

export default connect(mapStateToProps)(FreePieces);
