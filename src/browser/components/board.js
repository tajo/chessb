import React from 'react';
import {connect} from 'react-redux';
import Square from './square';
import {actions as gameActions} from '../redux/actions/game';
import {getSquareColor} from '../constants';
import {Record} from 'immutable';
import Component from 'react-pure-render/component';
import Promotion from './promotion';
import Gameover from './gameover';
import {translatePieceReverse} from '../lib/chess';

const mapStateToProps = (state) => ({
  game: state.game
});

class Board extends Component {

  static propTypes = {
    board: React.PropTypes.string.isRequired,
    game: React.PropTypes.instanceOf(Record).isRequired,
    move: React.PropTypes.func.isRequired
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

    const board = this.props.board === 'bBoard'
        ? this.props.game.get(this.props.board).get('board').reverse()
        : this.props.game.get(this.props.board).get('board');

    return (
      <div style={styles}>
        {this.props.game.get('winner') &&
          <Gameover
            color={this.props.game.getIn(['winner', 'color'])}
            wBoard={this.props.game.getIn(['winner', 'board'])}
            board={this.props.board}
          />
        }
        {this.props.game.getIn([this.props.board, 'promotion']) &&
          <Promotion
            color={this.props.game.getIn([this.props.board, 'turn'])}
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
        {board.map((piece, position) => {
          return (
            <Square
              color={getSquareColor(position)}
              key={position}
              position={position}
              piece={piece}
              board={this.props.board}
            />
          );
        })}
      </div>
    );
  }
}

export default connect(mapStateToProps, gameActions)(Board);
