import React from 'react';
import Component from 'react-pure-render/component';
import {COLORS, PIECES} from '../constants';

import bishopb from '../assets/chess/bishopb.png';
import bishopw from '../assets/chess/bishopw.png';
import knightb from '../assets/chess/knightb.png';
import knightw from '../assets/chess/knightw.png';
import queenb from '../assets/chess/queenb.png';
import queenw from '../assets/chess/queenw.png';
import rookb from '../assets/chess/rookb.png';
import rookw from '../assets/chess/rookw.png';

import styles from './promotion.scss';

class Promotion extends Component {

  static propTypes = {
    color: React.PropTypes.string.isRequired,
    finishMove: React.PropTypes.func.isRequired
  }

  render () {
    const overlayStyle = {
      height: '100%',
      width: '100%',
      backgroundColor: 'rgba(0, 0, 0, 0.4)',
      position: 'absolute'
    };

    return (
      <div style={overlayStyle}>
        <div style={{position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)'}}>
          <div style={{backgroundColor: 'rgba(255, 255, 255, 0)'}}>
            <img onClick={() => this.handleClick(this.props.color === COLORS.WHITE ? PIECES.QUEENW : PIECES.QUEENB)}
                 src={this.props.color === COLORS.WHITE ? queenw : queenb}
                 className={styles['piece']} />
            <img onClick={() => this.handleClick(this.props.color === COLORS.WHITE ? PIECES.ROOKW : PIECES.ROOKB)}
                 src={this.props.color === COLORS.WHITE ? rookw : rookb}
                 className={styles['piece']} />
            <img onClick={() => this.handleClick(this.props.color === COLORS.WHITE ? PIECES.KNIGHTW : PIECES.KNIGHTB)}
                 src={this.props.color === COLORS.WHITE ? knightw : knightb}
                 className={styles['piece']} />
            <img onClick={() => this.handleClick(this.props.color === COLORS.WHITE ? PIECES.BISHOPW : PIECES.BISHOPB)}
                 src={this.props.color === COLORS.WHITE ? bishopw : bishopb}
                 className={styles['piece']} />
          </div>
        </div>
      </div>
    );
  }

  handleClick (piece) {
    this.props.finishMove(piece);
  }
}

export default Promotion;
