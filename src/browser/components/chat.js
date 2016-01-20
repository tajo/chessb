import React from 'react';
import Component from 'react-pure-render/component';
import {connect} from 'react-redux';
import {Record} from 'immutable';
import {actionCreators as gameActions} from '../redux/actions/game';
import {COLORS} from '../../common/constants';

const mapStateToProps = (state) => ({
  game: state.game,
  user: state.user
});

const ENTER_KEY_CODE = 13;

class Chat extends Component {

  static propTypes = {
    game: React.PropTypes.instanceOf(Record).isRequired,
    user: React.PropTypes.instanceOf(Record).isRequired,
    sendChat: React.PropTypes.func.isRequired
  };

  constructor() {
    super();
    this.state = {text: ''};
  }

  componentDidUpdate(prevProps) {
    if (this.props.game.get('chat').count() !== prevProps.game.get('chat').count()) {
      if (this.refs.chatWindow) {
        this.refs.chatWindow.scrollTop = this.refs.chatWindow.scrollHeight;
      }
    }
  }

  render() {
    const chatWindowStyle = {
      width: '60vw',
      margin: '0px auto',
      marginBottom: 10,
      marginTop: 10,
      textAlign: 'left',
      height: 70,
      border: '1px solid #DDD',
      padding: 10,
      overflow: 'scroll',
      resize: 'vertical'
    };

    function getRowStyle(type) {
      let color = 'inherit';
      if (type === 'team') color = 'darkred';
      if (type === 'opponent' || type === 'player') color = 'blue';
      if (type === 'spec') color = '#666';
      return {
        margin: 0,
        color: color,
        fontSize: 14
      };
    }

    const inputStyle = {
      padding: 10,
      width: '60vw'
    };

    return (
      <div style={{textAlign: 'center'}}>
        {(this.props.game.get('chat').count() > 0) &&
          <div style={chatWindowStyle} ref="chatWindow">
            {this.props.game.get('chat').map((message, index) => {
              return (
                <p key={index} style={getRowStyle(this.getUserType(message.userId))}>
                  <b>{message.userId} ({this.getUserType(message.userId)}):</b> {message.text}
                </p>
              );
            })}
          </div>
        }
        <input
          style={inputStyle}
          onChange={(e) => this.setState({text: e.target.value})}
          onKeyDown={(e) => this.onEnter(e)}
          value={this.state.text}
          placeholder="Send message to everyone in this game..."
        />
      </div>
    );
  }

  getUserType(userId) {
    const myId = this.props.user.get('userId');
    if (myId === userId) {
      return 'you';
    }
    const seatA = this.props.game.getIn(['aBoard', COLORS.WHITE]);
    const seatB = this.props.game.getIn(['aBoard', COLORS.BLACK]);
    const seatC = this.props.game.getIn(['bBoard', COLORS.WHITE]);
    const seatD = this.props.game.getIn(['bBoard', COLORS.BLACK]);

    if (userId !== seatA && userId !== seatB && userId !== seatC && userId !== seatD) {
      return 'spec';
    }

    if (myId !== seatA && myId !== seatB && myId !== seatC && myId !== seatD) {
      return 'player';
    }

    if (myId === seatA) {
      if (userId === seatD) return 'team';
      return 'opponent';
    }

    if (myId === seatD) {
      if (userId === seatA) return 'team';
      return 'opponent';
    }

    if (myId === seatC) {
      if (userId === seatB) return 'team';
      return 'opponent';
    }

    if (myId === seatB) {
      if (userId === seatC) return 'team';
      return 'opponent';
    }
    return '???';
  }

  onEnter(event) {
    if (event.keyCode === ENTER_KEY_CODE) {
      this.props.sendChat(this.state.text);
      this.setState({text: ''});
    }
  }
}

export default connect(mapStateToProps, gameActions)(Chat);
