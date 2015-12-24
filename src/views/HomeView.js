import React from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router';
import { actions as counterActions } from '../redux/actions/counter';
import styles from './HomeView.scss';
import Piece, {PIECES} from '../components/piece';
import Square, {COLORS} from '../components/square';
import Board from '../components/board';

// We define mapStateToProps where we'd normally use
// the @connect decorator so the data requirements are clear upfront, but then
// export the decorated component after the main class definition so
// the component can be tested w/ and w/o being connected.
// See: http://rackt.github.io/redux/docs/recipes/WritingTests.html
const mapStateToProps = (state) => ({
  counter: state.counter.get('counter')
});

export class HomeView extends React.Component {
  static propTypes = {
    counter: React.PropTypes.number.isRequired,
    doubleAsync: React.PropTypes.func.isRequired,
    increment: React.PropTypes.func.isRequired
  }

  render () {
    return (
      <div className='container text-center'>
        <Board>
          <Square color={COLORS.WHITE}>
            <Piece type={PIECES.PAWNB} />
          </Square>
          <Square color={COLORS.BLACK}>
            <Piece type={PIECES.KINGW} />
          </Square>
          <Square color={COLORS.WHITE}>
            <Piece type={PIECES.PAWNB} />
          </Square>
          <Square color={COLORS.BLACK}>
            <Piece type={PIECES.KINGW} />
          </Square>
          <Square color={COLORS.WHITE}>
            <Piece type={PIECES.PAWNB} />
          </Square>
          <Square color={COLORS.BLACK}>
            <Piece type={PIECES.KINGW} />
          </Square>
          <Square color={COLORS.WHITE}>
            <Piece type={PIECES.PAWNB} />
          </Square>
          <Square color={COLORS.BLACK}>
            <Piece type={PIECES.KINGW} />
          </Square>
          <Square color={COLORS.WHITE}>
            <Piece type={PIECES.PAWNB} />
          </Square>
          <Square color={COLORS.BLACK}>
            <Piece type={PIECES.KINGW} />
          </Square>
          <Square color={COLORS.WHITE}>
            <Piece type={PIECES.PAWNB} />
          </Square>
          <Square color={COLORS.BLACK}>
            <Piece type={PIECES.KINGW} />
          </Square>
          <Square color={COLORS.WHITE}>
            <Piece type={PIECES.PAWNB} />
          </Square>
          <Square color={COLORS.BLACK}>
            <Piece type={PIECES.KINGW} />
          </Square>
          <Square color={COLORS.WHITE}>
            <Piece type={PIECES.PAWNB} />
          </Square>
          <Square color={COLORS.BLACK}>
            <Piece type={PIECES.KINGW} />
          </Square>
        </Board>

        <Link to='/counter'>Go To Counter</Link>
      </div>
    );
  }
}

export default connect(mapStateToProps, counterActions)(HomeView);
