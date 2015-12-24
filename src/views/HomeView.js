import React from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router';
import { actions as counterActions } from '../redux/actions/counter';
import styles from './HomeView.scss';
import Piece from '../components/piece';
import Square from '../components/square';
import {PIECES, COLORS, getSquareColor} from '../constants';
import Board from '../components/board';
import {Record} from 'immutable';

// We define mapStateToProps where we'd normally use
// the @connect decorator so the data requirements are clear upfront, but then
// export the decorated component after the main class definition so
// the component can be tested w/ and w/o being connected.
// See: http://rackt.github.io/redux/docs/recipes/WritingTests.html
const mapStateToProps = (state) => ({
  counter: state.counter.get('counter'),
  game: state.game
});

export class HomeView extends React.Component {
  static propTypes = {
    counter: React.PropTypes.number.isRequired,
    game: React.PropTypes.instanceOf(Record).isRequired,
    doubleAsync: React.PropTypes.func.isRequired,
    increment: React.PropTypes.func.isRequired
  }

  render () {
    console.log(this.props.game.get('aBoard'));
    return (
      <div className='container text-center'>
        <Board>
          {this.props.game.get('aBoard').map((val, key, iter) => {
            return (
              <Square color={getSquareColor(key)} key={key}>
                {val && <Piece type={val} />}
              </Square>
            );
          })}
        </Board>
      </div>
    );
  }
}

export default connect(mapStateToProps, counterActions)(HomeView);
