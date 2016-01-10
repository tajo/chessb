import React from 'react';
import {connect} from 'react-redux';
import Component from 'react-pure-render/component';
import {Record} from 'immutable';
import Board from '../components/board';
import FreePieces from '../components/freePieces';
import {COLORS} from '../../common/constants';
import Clock from './clock';
import Seat from './seat';


const mapStateToProps = (state) => ({
  game: state.game,
  user: state.user
});

class Desk extends Component {

  static propTypes = {
    board: React.PropTypes.string.isRequired,
    game: React.PropTypes.instanceOf(Record).isRequired,
    user: React.PropTypes.instanceOf(Record).isRequired,
    counter: React.PropTypes.number
  }

  renderBar(isReversed) {
    const barStyle = {
      width: '10vw',
      height: '42.5vw',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      fontSize: 12
    };

    const colorA = isReversed ? COLORS.BLACK : COLORS.WHITE;
    const colorB = isReversed ? COLORS.WHITE : COLORS.BLACK;

    return (
      <div style={barStyle}>
        <div style={{display: 'block', textAlign: 'center'}}>
          <Seat
            board={this.props.board}
            color={this.props.board === 'aBoard' ? colorB : colorA}
          />
          <Clock
            board={this.props.board}
            color={this.props.board === 'aBoard' ? colorB : colorA}
          />
          <div style={{height: '5vw'}}> </div>
          <Clock
            board={this.props.board}
            color={this.props.board === 'aBoard' ? colorA : colorB}
          />
          <Seat
            board={this.props.board}
            color={this.props.board === 'aBoard' ? colorA : colorB}
          />
        </div>
      </div>
    );
  }

  render() {
    const rootStyle = {
      display: 'flex',
      flexWrap: 'wrap'
    };

    const myUserId = this.props.user.get('userId');
    const aBoardBlack = this.props.game.getIn(['aBoard', COLORS.BLACK]);
    const bBoardWhite = this.props.game.getIn(['bBoard', COLORS.WHITE]);
    const isReversed = (myUserId && (aBoardBlack === myUserId || bBoardWhite === myUserId));

    return (
      <div style={rootStyle}>
        {this.props.board === 'aBoard' && this.renderBar(isReversed)}
        <div>
          <FreePieces
            color={this.props.board === 'aBoard' ? COLORS.BLACK : COLORS.WHITE}
            board={this.props.board}
          />
          <Board board={this.props.board} isReversed={isReversed} counter={this.props.counter} />
          <FreePieces
            color={this.props.board === 'aBoard' ? COLORS.WHITE : COLORS.BLACK}
            board={this.props.board}
          />
        </div>
        {this.props.board === 'bBoard' && this.renderBar(isReversed)}
      </div>
    );
  }
}

export default connect(mapStateToProps)(Desk);
