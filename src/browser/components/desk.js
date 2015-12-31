import React from 'react';
import Component from 'react-pure-render/component';
import Board from '../components/board';
import FreePieces from '../components/freePieces';
import {COLORS} from '../constants';
import Clock from './clock';

import '../styles/button.scss';

class Desk extends Component {

  static propTypes = {
    board: React.PropTypes.string.isRequired
  }

  renderBar() {
    const barStyle = {
      width: '10vw',
      height: '42.5vw',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      fontSize: 12
    };

    return (
      <div style={barStyle}>
        <div style={{display: 'block', textAlign: 'center'}}>
          <div><a href="#">tajo (1890)</a></div>
          <button className="pureButton">Join Game</button>
          <Clock
            board={this.props.board}
            color={this.props.board === 'aBoard' ? COLORS.BLACK : COLORS.WHITE}
          />
          <div style={{height: '5vw'}}> </div>
          <Clock
            board={this.props.board}
            color={this.props.board === 'aBoard' ? COLORS.WHITE : COLORS.BLACK}
          />
          <button className="pureButton">Leave Game</button>
          <div><a href="#">garry (2803)</a></div>
        </div>
      </div>
    );
  }

  render() {
    const rootStyle = {
      display: 'flex',
      flexWrap: 'wrap'
    };
    return (
      <div style={rootStyle}>
        {this.props.board === 'aBoard' && this.renderBar()}
        <div>
          <FreePieces
            color={this.props.board === 'aBoard' ? COLORS.BLACK : COLORS.WHITE}
            board={this.props.board}
          />
          <Board board={this.props.board} />
          <FreePieces
            color={this.props.board === 'aBoard' ? COLORS.WHITE : COLORS.BLACK}
            board={this.props.board}
          />
        </div>
        {this.props.board === 'bBoard' && this.renderBar()}
      </div>
    );
  }
}

export default Desk;
