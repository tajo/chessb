import React from 'react';
import Component from 'react-pure-render/component';
import {connect} from 'react-redux';
import {Link} from 'react-router';
import {Map} from 'immutable';
import {actionCreators as gameActions} from '../redux/actions/game';

import '../styles/table.scss';
import '../styles/button.scss';

const mapStateToProps = (state) => ({
  games: state.meta.get('games'),
  gameId: state.user.get('gameId')
});

class Games extends Component {

  static propTypes = {
    games: React.PropTypes.instanceOf(Map).isRequired,
    gameId: React.PropTypes.string,
    addNewGame: React.PropTypes.func.isRequired,
    switchGame: React.PropTypes.func.isRequired
  };

  render() {
    return (
      <div style={{padding: '10px 60px 10px 60px', textAlign: 'center'}}>
        <h1>Games</h1>
        <table className="pure-table" style={{margin: '0px auto'}}>
          <thead>
            <tr>
              <td>Game ID</td>
              <td>State</td>
              <td>Seats</td>
              <td>Spectators</td>
            </tr>
          </thead>
          <tbody>
            {this.props.games.valueSeq().map(game => {
              return (
                <tr key={game.get('gameId')}>
                  <td>
                    {game.get('gameId') === this.props.gameId
                        ? (<b title="You are in this game.">{game.get('gameId')}</b>) :
                      <Link
                        onClick={() => this.switchGame(game.get('gameId'))}
                        to={`/game/${game.get('gameId')}`}
                      >
                        {game.get('gameId')}
                      </Link>
                    }
                  </td>
                  <td>{game.get('startDate') ? 'Running' : 'Idle'}</td>
                  <td>{game.get('players')}/4</td>
                  <td>{game.get('specs')}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
        {this.props.games.every(game => game.get('players'))
          && <button
            onClick={this.props.addNewGame}
            style={{marginTop: 15}}
            className="pureButton"
          >
            Add new game
          </button>}
      </div>
    );
  }

  switchGame(gameId) {
    this.props.switchGame(gameId);
  }
}

export default connect(mapStateToProps, gameActions)(Games);
