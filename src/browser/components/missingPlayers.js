import React from 'react';
import Component from 'react-pure-render/component';
import {connect} from 'react-redux';
import {Record} from 'immutable';
import {COLORS} from '../../common/constants';
import {Link} from 'react-router';

const mapStateToProps = (state) => ({
  game: state.game
});

class MissingPlayers extends Component {

  static propTypes = {
    game: React.PropTypes.instanceOf(Record).isRequired
  };

  render() {
    const notificationStyles = {
      position: 'absolute',
      width: '100%',
      top: 0
    };

    const notificationInnerStyles = {
      backgroundColor: 'darkred',
      color: '#FFF',
      width: 600,
      margin: '0px auto',
      textAlign: 'center',
      padding: 10
    };

    let missingP = 0;
    if (!this.props.game.getIn(['aBoard', COLORS.WHITE])) missingP += 1;
    if (!this.props.game.getIn(['aBoard', COLORS.BLACK])) missingP += 1;
    if (!this.props.game.getIn(['bBoard', COLORS.WHITE])) missingP += 1;
    if (!this.props.game.getIn(['bBoard', COLORS.BLACK])) missingP += 1;

    if (!missingP || this.props.game.get('startDate')) {
      return null;
    }

    return (
      <div style={notificationStyles}>
        <div style={notificationInnerStyles}>
          This game is waiting for <b>{missingP} more player{missingP > 1 && 's'}</b>.{' '}
          Share the game{' '}
          <Link style={{color: '#FFF'}} to={`/game/${this.props.game.get('gameId')}`}>
            <b>URL</b>
          </Link> with your friends!
        </div>
      </div>
    );
  }
}

export default connect(mapStateToProps)(MissingPlayers);
