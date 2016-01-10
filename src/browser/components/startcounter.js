import React from 'react';
import Component from 'react-pure-render/component';

class Startcounter extends Component {

  static propTypes = {
    counter: React.PropTypes.number.isRequired,
  }

  constructor(props) {
    super(props);
    this.state = {counter: props.counter};
  }

  componentWillReceiveProps(newProps) {
    if (newProps.counter !== this.props.counter) {
      this.setState({counter: newProps.counter});
      if (newProps.counter > 0) {
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
    const overlayStyle = {
      height: '100%',
      width: '100%',
      backgroundColor: 'rgba(0, 0, 0, 0.4)',
      position: 'absolute'
    };

    if (this.state.counter < 200) {
      return null;
    }

    return (
      <div style={overlayStyle}>
        <div style={{position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)'}}>
          <div style={{backgroundColor: 'rgba(255, 255, 255, 0.8)', fontSize: '2vw', padding: 20, fontWeight: 'bold'}}>
            Game starts in
            <div style={{fontSize: '4vw', textAlign: 'center'}}>
              {Math.round(this.state.counter / 1000)}
            </div>
          </div>
        </div>
      </div>
    );
  }

}

export default Startcounter;
