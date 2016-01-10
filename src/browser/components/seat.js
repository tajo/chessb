import React from 'react';
import Component from 'react-pure-render/component';
import {connect} from 'react-redux';
import {Record} from 'immutable';
import {COLORS} from '../../common/constants';
import {actions as gameActions} from '../redux/actions/game';

import '../styles/button.scss';

const mapStateToProps = (state) => ({
  game: state.game,
  user: state.user
});

class Seat extends Component {

  static propTypes = {
    color: React.PropTypes.string.isRequired,
    board: React.PropTypes.string.isRequired,
    game: React.PropTypes.instanceOf(Record).isRequired,
    user: React.PropTypes.instanceOf(Record).isRequired,
    joinLeaveGame: React.PropTypes.func.isRequired
  }

  renderName(userId, myUserId) {
    const you = userId === myUserId ? (<b style={{color: 'darkred'}}>YOU!</b>) : null;
    return (
      <div>{userId ? (<div><a href="#">{userId}</a> {you}</div>) : 'empty'}</div>
    );
  }

  render() {
    const isBefore =
      (this.props.color === COLORS.BLACK && this.props.board === 'aBoard') ||
      (this.props.color === COLORS.WHITE && this.props.board === 'bBoard');

    const userId = this.props.game.getIn([this.props.board, this.props.color]);
    const myUserId = this.props.user.get('userId');

    const checkA = this.props.game.getIn([this.props.board === 'bBoard' ? 'aBoard' : 'bBoard', this.props.color]);
    const checkB = this.props.game.getIn([this.props.board, this.props.color === COLORS.BLACK ? COLORS.WHITE : COLORS.BLACK]);

    return (
      <div>
        {isBefore && this.renderName(userId, myUserId)}
        <button
          className="pureButton"
          disabled={(checkA === myUserId || checkB === myUserId || (userId !== myUserId && userId))}
          onClick={() => this.props.joinLeaveGame(this.props.board, this.props.color, this.props.user.gameId)}
        >
          {(userId && userId === myUserId) ? 'Leave Game' : 'Join Game'}
        </button>
        {!isBefore && this.renderName(userId, myUserId)}
      </div>
    );
  }
}

export default connect(mapStateToProps, gameActions)(Seat);
