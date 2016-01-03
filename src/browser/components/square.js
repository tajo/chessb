import React from 'react';
import {COLORS} from '../../common/constants';
import {DropTarget} from 'react-dnd';
import {actions as gameActions} from '../redux/actions/game';
import {connect} from 'react-redux';
import {Record} from 'immutable';
import Piece from '../components/piece';
import {isMoveLegal, isPieceMovebale} from '../../common/chess';
import Component from 'react-pure-render/component';

const squareTarget = {
  canDrop(props, monitor) {
    return isMoveLegal(
      props.game.getIn([props.board, 'engine']),
      monitor.getItem().position,
      props.position
    ) && props.board === monitor.getItem().board;
  },

  drop(props, monitor) {
    props.move(
      props.board,
      monitor.getItem().position,
      props.position,
      monitor.getItem().type
    );
  }
};

function collect(connect, monitor) {
  return {
    connectDropTarget: connect.dropTarget(),
    isOver: monitor.isOver(),
    canDrop: monitor.canDrop()
  };
}

const mapStateToProps = (state) => ({
  game: state.game
});

class Square extends Component {

  static propTypes = {
    children: React.PropTypes.object,
    color: React.PropTypes.string.isRequired,
    piece: React.PropTypes.string,
    position: React.PropTypes.string.isRequired,
    isOver: React.PropTypes.bool.isRequired,
    canDrop: React.PropTypes.bool.isRequired,
    connectDropTarget: React.PropTypes.func.isRequired,
    move: React.PropTypes.func.isRequired,
    selectSquare: React.PropTypes.func.isRequired,
    board: React.PropTypes.string.isRequired,
    game: React.PropTypes.instanceOf(Record).isRequired
  }

  render() {
    const styles = {
      backgroundColor: this.props.color === COLORS.BLACK ? '#b58863' : '#f0d9b5',
      color: this.props.color === COLORS.WHITE ? '#b58863' : '#f0d9b5',
      width: '12.5%',
      height: '12.5%'
    };

    const emptySquareStyle = {
      height: '100%',
      width: '100%',
      border: (this.props.isOver && this.props.canDrop) ? '2px dashed black' : 'none'
    };

    return this.props.connectDropTarget(
      <div style={styles} onClick={(e) => this.handleClick(e)}>
        {this.props.piece ?
          <Piece
            type={this.props.piece}
            isSelected={this.props.game.getIn([this.props.board, 'squareSelected', 'position']) === this.props.position}
            overDrop={this.props.isOver && this.props.canDrop}
            position={this.props.position}
            canDrag={isPieceMovebale(this.props.game.getIn([this.props.board, 'engine']), this.props.position)}
            board={this.props.board}
          />
         : <div style={emptySquareStyle} />}
      </div>
    );
  }

  handleClick() {
    if (this.props.game.getIn([this.props.board, 'squareSelected'])) {
      if (this.props.game.getIn([this.props.board, 'squareSelected', 'position']) === this.props.position) {
        this.props.selectSquare(this.props.board, null, this.props.piece);
        return;
      }
      if (isMoveLegal(
        this.props.game.getIn([this.props.board, 'engine']),
        this.props.game.getIn([this.props.board, 'squareSelected', 'position']),
        this.props.position
      )) {
        this.props.move(
          this.props.game.getIn([this.props.board, 'engine']),
          this.props.board,
          this.props.game.getIn([this.props.board, 'squareSelected', 'position']),
          this.props.position,
          this.props.game.getIn([this.props.board, 'squareSelected', 'piece'])
        );
      } else {
        if (isPieceMovebale(this.props.game.getIn([this.props.board, 'engine']), this.props.position)) {
          this.props.selectSquare(this.props.board, this.props.position, this.props.piece);
        }
      }
    } else {
      if (isPieceMovebale(this.props.game.getIn([this.props.board, 'engine']), this.props.position)) {
        this.props.selectSquare(this.props.board, this.props.position, this.props.piece);
      }
    }
  }
}

export default connect(mapStateToProps, gameActions)(DropTarget('piece', squareTarget, collect)(Square));
