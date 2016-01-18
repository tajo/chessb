import React from 'react';
import {connect} from 'react-redux';
import Component from 'react-pure-render/component';
import {DragDropContext} from 'react-dnd';
import HTML5Backend from 'react-dnd-html5-backend';
import Desk from '../components/desk';
import Onlinecount from '../components/onlinecount';
import Games from '../components/games';
import moment from 'moment';
import {Record} from 'immutable';

const mapStateToProps = (state) => ({
  game: state.game
});


class HomeView extends Component {

  static propTypes = {
    game: React.PropTypes.instanceOf(Record).isRequired,
  };

  constructor(props) {
    super(props);
    this.state = {counter: getCounter(props.game.get('startDate'))};
  }

  componentWillReceiveProps(newProps) {
    if (newProps.game.get('startDate') !== this.props.game.get('startDate')) {
      this.setState({counter: getCounter(newProps.game.get('startDate'))});
      if (getCounter(newProps.game.get('startDate')) > 0) {
        setTimeout(() => this.tick(), 1000);
      }
    }
  }

  tick() {
    this.setState(prevState => {
      return {counter: prevState.counter - 1000};
    });

    if (this.state.counter >= 1) {
      setTimeout(() => this.tick(), 1000);
    }
  }

  render() {
    const rootStyles = {
      display: 'flex',
      flexDirection: 'row',
      flexWrap: 'noWrap',
      width: '100%',
      paddingTop: 10,
      justifyContent: 'center'
    };
    return (
      <div>
        <div style={rootStyles}>
          <Desk board="aBoard" counter={this.state.counter} />
          <Desk board="bBoard" counter={this.state.counter} />
        </div>
        <Games />
        <Onlinecount />
      </div>
    );
  }
}

function getCounter(startDate) {
  if (startDate) {
    const diff = moment(startDate).diff(moment());
    if (diff > 0) {
      return diff;
    }
    return 0;
  }
}

export default connect(mapStateToProps)(DragDropContext(HTML5Backend)(HomeView));
