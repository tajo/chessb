import React from 'react';
import Component from 'react-pure-render/component';
import Board from '../components/board';
import FreePieces from '../components/freePieces';
import {COLORS} from '../constants';

import styles from '../styles/button.scss';

class Desk extends Component {

  static propTypes = {
    board: React.PropTypes.string.isRequired
  }

  renderBar () {
    const barStyle = {
      width: '10vw',
      height: '42.5vw',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      fontSize: 12
    };

    const clockStyle = {
      fontSize: 40,
      fontWeight: 'bold'
    };

    return (
      <div style={barStyle}>
        <div style={{display: 'block', textAlign: 'center'}}>
          <div><a href='#'>tajo (1890)</a></div>
          <button className={styles['pure-button']}>Join Game</button>
          <div style={clockStyle}>3:14</div>
          <div style={{height: '5vw'}}> </div>
          <div style={clockStyle}>3:13</div>
          <button className={styles['pure-button']}>Leave Game</button>
          <div><a href='#'>garry (2803)</a></div>
        </div>
      </div>
    );
  }

  render () {
    const rootStyle = {
      display: 'flex',
      flexWrap: 'wrap'
    };
    return (
      <div style={rootStyle}>
        {this.props.board === 'aBoard' && this.renderBar()}
        <div>
          <FreePieces color={this.props.board === 'aBoard' ? COLORS.BLACK : COLORS.WHITE}
                      board={this.props.board} />
          <Board board={this.props.board} />
          <FreePieces color={this.props.board === 'aBoard' ? COLORS.WHITE : COLORS.BLACK}
                      board={this.props.board} />
        </div>
        {this.props.board === 'bBoard' && this.renderBar()}
      </div>
    );
  }
}

export default Desk;
