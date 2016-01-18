import React from 'react';
import Component from 'react-pure-render/component';
import {connect} from 'react-redux';
import {Link} from 'react-router';
import {Map} from 'immutable';

import '../styles/table.scss';

const mapStateToProps = (state) => ({
  games: state.meta.get('games')
});

class Games extends Component {

  static propTypes = {
    games: React.PropTypes.instanceOf(Map).isRequired
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
                  <td><Link to={`/game/${game.get('gameId')}`}>{game.get('gameId')}</Link></td>
                  <td>{game.get('startDate') ? 'Running' : 'Idle'}</td>
                  <td>{game.get('players')}/4</td>
                  <td>{game.get('specs')}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    );
  }
}

export default connect(mapStateToProps)(Games);
