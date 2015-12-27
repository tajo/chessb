import React from 'react';
import {connect} from 'react-redux';
import {DragDropContext} from 'react-dnd';
import HTML5Backend from 'react-dnd-html5-backend';
import Square from './square';
import {actions as gameActions} from '../redux/actions/game';
import {getSquareColor} from '../constants';
import {Record} from 'immutable';
import Component from 'react-pure-render/component';
import Promotion from './promotion';
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

  render () {
    const styles = {
      width: '100vmin',
      height: '100vmin',
      position: 'relative'
    };

    return (
      <div style={styles}>
        {this.props.game.getIn([this.props.board, 'promotion']) &&
          <Promotion color={this.props.game.getIn([this.props.board, 'turn'])}
                     finishMove={(promotion) => {
                       this.props.move(
                         this.props.game.getIn([this.props.board, 'engine']),
                         this.props.board,
                         this.props.game.getIn([this.props.board, 'promotion', 'from']),
                         this.props.game.getIn([this.props.board, 'promotion', 'to']),
                         promotion,
                         translatePieceReverse(promotion).type
                       );
                     }}
          />
        }
        {this.props.game.get(this.props.board).get('board').map((piece, position) => {
          return (
            <Square color={getSquareColor(position)}
                    key={position}
                    position={position}
                    piece={piece}
                    board={this.props.board} />
          );
        })}
      </div>
    );
  }
}

export default connect(mapStateToProps, gameActions)(DragDropContext(HTML5Backend)(Board));
