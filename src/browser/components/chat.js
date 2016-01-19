import React from 'react';
import Component from 'react-pure-render/component';
import {connect} from 'react-redux';
import {Record} from 'immutable';
import {actionCreators as gameActions} from '../redux/actions/game';

const mapStateToProps = (state) => ({
  game: state.game
});

const ENTER_KEY_CODE = 13;

class Chat extends Component {

  static propTypes = {
    game: React.PropTypes.instanceOf(Record).isRequired,
    sendChat: React.PropTypes.func.isRequired
  };

  constructor() {
    super();
    this.state = {text: ''};
  }

  componentDidUpdate(prevProps) {
    if (this.props.game.get('chat').count() !== prevProps.game.get('chat').count()) {
      this.refs.chatWindow.scrollTop = this.refs.chatWindow.scrollHeight;
    }
  }

  render() {
    const chatWindowStyle = {
      width: '60vw',
      margin: '0px auto',
      marginBottom: 10,
      marginTop: 10,
      textAlign: 'left',
      height: 100,
      border: '1px solid #DDD',
      padding: 10,
      overflow: 'scroll'
    };

    const rowStyle = {
      margin: 0
    };

    const inputStyle = {
      padding: 10,
      width: '60vw'
    };

    return (
      <div style={{textAlign: 'center'}}>
        {(this.props.game.get('chat').count() > 0) &&
          <div style={chatWindowStyle} ref="chatWindow">
            {this.props.game.get('chat').map((message, index) => {
              return <p key={index} style={rowStyle}><b>{message.userId}:</b> {message.text}</p>;
            })}
          </div>
        }
        <input
          style={inputStyle}
          onChange={(e) => this.setState({text: e.target.value})}
          onKeyDown={(e) => this.onEnter(e)}
          value={this.state.text}
          placeholder="Send message to this game..."
        />
      </div>
    );
  }

  onEnter(event) {
    if (event.keyCode === ENTER_KEY_CODE) {
      this.props.sendChat(this.state.text);
      this.setState({text: ''});
    }
  }
}

export default connect(mapStateToProps, gameActions)(Chat);
