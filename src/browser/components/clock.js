import React from 'react';
import Component from 'react-pure-render/component';
import {connect} from 'react-redux';
import {Record} from 'immutable';
import moment from 'moment';
import {COLORS, GAME_TIME} from '../../common/constants';
import {actionCreators as gameActions} from '../redux/actions/game';

const UPDATE_TIME = 500;

const mapStateToProps = (state) => ({
  game: state.game
});

class Clock extends Component {

  static propTypes = {
    color: React.PropTypes.string.isRequired,
    board: React.PropTypes.string.isRequired,
    game: React.PropTypes.instanceOf(Record).isRequired,
    timeRanOut: React.PropTypes.func.isRequired
  };

  constructor(props) {
    super(props);
    this.state = {counter: GAME_TIME};
    this.running = false;
  }

  componentWillReceiveProps(newProps) {
    if (newProps.game.getIn([newProps.board, 'dates']).count() ===
      this.props.game.getIn([this.props.board, 'dates']).count() &&
      this.props.game.get('gameId') === newProps.game.get('gameId')) {
      return;
    }

    const interval = this.props.game.get('gameTime') ?
      this.props.game.get('gameTime') : newProps.game.get('gameTime');

    this.setState({counter: this.getCounter(
      newProps.game.getIn([newProps.board, 'dates']),
      newProps.color,
      newProps.game.get('startDate'),
      interval)});
  }

  componentDidUpdate(prevProps) {
    if (this.props.game.get('gameId') &&
        prevProps.game.get('gameId') &&
        this.props.game.get('gameId') !== prevProps.game.get('gameId')) {
      if (!this.running) this.tick();
      return;
    }
  }

  componentDidMount() {
    setTimeout(() => this.tick(), UPDATE_TIME);
  }

  getCounter(dates, color, startDate, interval) {
    if (!startDate || !interval || !dates.count()) return GAME_TIME;
    let counter = interval;
    dates
      .push(moment().toISOString())
      .unshift(startDate)
      .forEach((val, index, arr) => {
        if (color === COLORS.WHITE && (index % 2) && index) {
          counter = counter - moment(val).diff(moment(arr.get(index - 1)));
        }
        if (color === COLORS.BLACK && !(index % 2) && index) {
          counter = counter - moment(val).diff(moment(arr.get(index - 1)));
        }
      });
    return counter;
  }

  tick() {
    if (this.props.game.get('winner')) {
      this.running = false;
      return;
    }
    if (!this.props.game.get('startDate') || moment(this.props.game.get('startDate')).isAfter(moment())) {
      this.running = true;
      setTimeout(() => this.tick(), UPDATE_TIME);
      return;
    }
    this.setState((prevState, props) => {
      if (props.color === COLORS.WHITE && !(props.game.getIn([props.board, 'dates']).count() % 2)) {
        return {counter: prevState.counter - UPDATE_TIME};
      }
      if (props.color === COLORS.BLACK && props.game.getIn([props.board, 'dates']).count() % 2) {
        return {counter: prevState.counter - UPDATE_TIME};
      }
      return {counter: prevState.counter};
    });
    if (this.state.counter <= 0) {
      this.running = false;
      this.props.timeRanOut(this.props.board, this.props.color);
    } else {
      this.running = true;
      setTimeout(() => this.tick(), UPDATE_TIME);
    }
  }

  render() {
    const clockStyle = {
      fontSize: 40,
      fontWeight: 'bold'
    };

    const mins = Math.floor(this.state.counter / 60000);
    const secs = Math.floor((this.state.counter - (Math.floor(this.state.counter / 60000) * 60000)) / 1000);
    if (this.state.counter <= 0) {
      return <div style={clockStyle}>0:00</div>;
    }
    return (
      <div style={clockStyle}>{mins}:{secs < 10 && '0'}{secs}</div>
    );
  }
}

export default connect(mapStateToProps, gameActions)(Clock);
