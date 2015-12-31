import React from 'react';
import Component from 'react-pure-render/component';
import {COLORS} from '../constants';

class Gameover extends Component {

  static propTypes = {
    color: React.PropTypes.string.isRequired,
    wBoard: React.PropTypes.string.isRequired,
    board: React.PropTypes.string.isRequired
  }

  getWinner() {
    if (this.props.board === this.props.wBoard) {
      if (this.props.color === COLORS.WHITE) {
        return 'White wins';
      }
      return 'Black wins';
    }
    if (this.props.color === COLORS.WHITE) {
      return 'Black wins';
    }
    return 'White wins';
  }

  render() {
    const overlayStyle = {
      height: '100%',
      width: '100%',
      backgroundColor: 'rgba(0, 0, 0, 0.4)',
      position: 'absolute'
    };

    return (
      <div style={overlayStyle}>
        <div style={{position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)'}}>
          <div style={{backgroundColor: 'rgba(255, 255, 255, 0.8)', fontSize: 30, padding: 20, fontWeight: 'bold'}}>
            GAME OVER
            <div style={{fontSize: 20, textAlign: 'center'}}>
              {this.getWinner()}
            </div>
          </div>
        </div>
      </div>
    );
  }

}

export default Gameover;
