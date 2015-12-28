import React from 'react';
import Component from 'react-pure-render/component';
import Board from '../components/board';
import FreePieces from '../components/freePieces';
import {COLORS} from '../constants';

class Desk extends Component {

  static propTypes = {
    board: React.PropTypes.string.isRequired
  }

  render () {
    return (
      <div>
        <FreePieces color={this.props.board === 'aBoard' ? COLORS.BLACK : COLORS.WHITE}
                    board={this.props.board} />
        <Board board={this.props.board} />
        <FreePieces color={this.props.board === 'aBoard' ? COLORS.WHITE : COLORS.BLACK}
                    board={this.props.board} />
      </div>
    );
  }
}

export default Desk;
