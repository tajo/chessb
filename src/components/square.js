import React from 'react';
import {COLORS} from '../constants';
import {DropTarget} from 'react-dnd';
import {actions as gameActions} from '../redux/actions/game';
import {connect} from 'react-redux';
import {Record} from 'immutable';
import Piece from '../components/piece';
import {isMoveLegal, isPieceMovebale} from '../lib/chess';

const squareTarget = {
  canDrop (props, monitor) {
    return !!isMoveLegal(
      props.game.getIn([props.board, 'engine']),
      monitor.getItem().position,
      props.position
    );
  },

  drop (props, monitor) {
    console.log(props.move(
      props.game.getIn([props.board, 'engine']),
      props.board,
      monitor.getItem().position,
      props.position,
      monitor.getItem().type
    ));
  }
};

function collect (connect, monitor) {
  return {
    connectDropTarget: connect.dropTarget(),
    isOver: monitor.isOver(),
    canDrop: monitor.canDrop()
  };
}

const mapStateToProps = (state) => ({
  game: state.game
});

class Square extends React.Component {

  static propTypes = {
    children: React.PropTypes.object,
    color: React.PropTypes.string.isRequired,
    piece: React.PropTypes.string,
    position: React.PropTypes.string.isRequired,
    isOver: React.PropTypes.bool.isRequired,
    canDrop: React.PropTypes.bool.isRequired,
    connectDropTarget: React.PropTypes.func.isRequired,
    move: React.PropTypes.func.isRequired,
    board: React.PropTypes.string.isRequired,
    game: React.PropTypes.instanceOf(Record).isRequired
  }

  render () {
    const styles = {
      backgroundColor: this.props.color === COLORS.BLACK ? '#b58863' : '#f0d9b5',
      color: this.props.color === COLORS.WHITE ? '#b58863' : '#f0d9b5',
      width: '12.5%',
      height: '12.5%',
      float: 'left',
      border: (this.props.isOver && this.props.canDrop) ? '3px solid darkred' : 'none'
    };

    return this.props.connectDropTarget(
      <div style={styles}>
        {this.props.piece && <Piece type={this.props.piece}
                                    position={this.props.position}
                                    canDrag={isPieceMovebale(this.props.game.getIn([this.props.board, 'engine']), this.props.position)} />
        }
      </div>
    );
  }
}

export default connect(mapStateToProps, gameActions)(DropTarget('piece', squareTarget, collect)(Square));
