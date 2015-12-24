import React from 'react';
import {PIECES} from '../constants';

import bishopb from '../assets/chess/bishopb.svg';
import bishopw from '../assets/chess/bishopw.svg';
import kingb from '../assets/chess/kingb.svg';
import kingw from '../assets/chess/kingw.svg';
import knightb from '../assets/chess/knightb.svg';
import knightw from '../assets/chess/knightw.svg';
import pawnb from '../assets/chess/pawnb.svg';
import pawnw from '../assets/chess/pawnw.svg';
import queenb from '../assets/chess/queenb.svg';
import queenw from '../assets/chess/queenw.svg';
import rookb from '../assets/chess/rookb.svg';
import rookw from '../assets/chess/rookw.svg';

export default class Piece extends React.Component {

  static propTypes = {
    type: React.PropTypes.string.isRequired
  }

  render () {
    return (
      <div height='100%' width='100%'>
        <img src={getPic(this.props.type)} height='100%' width='100%' />
      </div>
    );
  }
}

function getPic (type) {
  if (type === PIECES.BISHOPB) return bishopb;
  if (type === PIECES.BISHOPW) return bishopw;
  if (type === PIECES.KINGB) return kingb;
  if (type === PIECES.KINGW) return kingw;
  if (type === PIECES.KNIGHTB) return knightb;
  if (type === PIECES.KNIGHTW) return knightw;
  if (type === PIECES.PAWNB) return pawnb;
  if (type === PIECES.PAWNW) return pawnw;
  if (type === PIECES.QUEENB) return queenb;
  if (type === PIECES.QUEENW) return queenw;
  if (type === PIECES.ROOKB) return rookb;
  if (type === PIECES.ROOKW) return rookw;
}
