import React from 'react';
import {connect} from 'react-redux';
import { DragDropContext } from 'react-dnd';
import HTML5Backend from 'react-dnd-html5-backend';
import Square from './square';
import {getSquareColor, COLORS} from '../constants';
import {Record} from 'immutable';
import Component from 'react-pure-render/component';
import Promotion from './promotion';

const mapStateToProps = (state) => ({
  game: state.game
});

class Board extends Component {

  static propTypes = {
    board: React.PropTypes.string.isRequired,
    game: React.PropTypes.instanceOf(Record).isRequired
  }

  render () {
    const styles = {
      width: '100vmin',
      height: '100vmin',
      position: 'relative'
    };

    return (
      <div style={styles}>
        <Promotion color={COLORS.WHITE} />
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

export default connect(mapStateToProps)(DragDropContext(HTML5Backend)(Board));
