import React from 'react';
import Component from 'react-pure-render/component';

class Startcounter extends Component {

  static propTypes = {
    counter: React.PropTypes.number.isRequired,
  };

  render() {
    const overlayStyle = {
      height: '100%',
      width: '100%',
      backgroundColor: 'rgba(0, 0, 0, 0.4)',
      position: 'absolute'
    };

    return (
      <div style={overlayStyle}>
        <div style={{position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)'}}>
          <div style={{backgroundColor: 'rgba(255, 255, 255, 0.8)', fontSize: '2vw', padding: 20, fontWeight: 'bold'}}>
            Game starts in
            <div style={{fontSize: '4vw', textAlign: 'center'}}>
              {Math.round(this.props.counter / 1000)}
            </div>
          </div>
        </div>
      </div>
    );
  }

}

export default Startcounter;
