import React from 'react';
import {connect} from 'react-redux';
import Square from './square';
import {actionCreators as gameActions} from '../redux/actions/game';
import {getSquareColor} from '../../common/constants';
import {Record} from 'immutable';
import Component from 'react-pure-render/component';
import Promotion from './promotion';
import Gameover from './gameover';
import Startcounter from './startcounter';
import {translatePieceReverse, getPieces, getColor} from '../../common/chess';

const mapStateToProps = (state) => ({
  game: state.game,
  user: state.user
});

class Board extends Component {

  static propTypes = {
    board: React.PropTypes.string.isRequired,
    isReversed: React.PropTypes.bool,
    game: React.PropTypes.instanceOf(Record).isRequired,
    move: React.PropTypes.func.isRequired,
    counter: React.PropTypes.number
  };

  componentWillReceiveProps(nextProps) {
    if (this.props.counter !== nextProps.counter && Math.round(nextProps.counter / 1000) === 3) {
      const startSound = new Audio('/assets/start.wav');
      startSound.load();
      startSound.volume = 0.2;
      startSound.play();
    }
  }

  render() {
    const styles = {
      width: '35vw',
      height: '35vw',
      position: 'relative',
      margin: '5px 15px 5px 15px',
      display: 'flex',
      flexWrap: 'wrap'
    };

    let board = null;
    if (this.props.isReversed) {
      board = this.props.board === 'bBoard'
        ? getPieces(this.props.game.get(this.props.board).get('engine').board)
        : getPieces(this.props.game.get(this.props.board).get('engine').board).reverse();
    } else {
      board = this.props.board === 'bBoard'
        ? getPieces(this.props.game.get(this.props.board).get('engine').board).reverse()
        : getPieces(this.props.game.get(this.props.board).get('engine').board);
    }

    return (
      <div style={styles}>
        {this.props.game.get('winner') &&
          <Gameover
            color={this.props.game.getIn(['winner', 'color'])}
            wBoard={this.props.game.getIn(['winner', 'board'])}
            board={this.props.board}
          />
        }
        {this.props.counter > 0 && <Startcounter counter={this.props.counter} />}
        {this.props.game.getIn([this.props.board, 'promotion']) &&
          <Promotion
            color={getColor(this.props.game.getIn([this.props.board, 'engine']))}
            finishMove={(promotion) => {
              this.props.move(
                this.props.board,
                this.props.game.getIn([this.props.board, 'promotion', 'from']),
                this.props.game.getIn([this.props.board, 'promotion', 'to']),
                promotion,
                translatePieceReverse(promotion).type
              );
            }}
          />
        }
        {board.valueSeq().map((piece) => {
          return (
            <Square
              color={getSquareColor(piece.get('position'))}
              key={piece.get('position')}
              position={piece.get('position')}
              piece={piece.get('type')}
              board={this.props.board}
            />
          );
        })}
      </div>
    );
  }
}

export default connect(mapStateToProps, gameActions)(Board);
