import React from 'react';
import Component from 'react-pure-render/component';
import {connect} from 'react-redux';

const mapStateToProps = (state) => ({
  counter: state.meta.get('onlinecount')
});

class Onlinecount extends Component {

  static propTypes = {
    counter: React.PropTypes.number.isRequired
  };

  render() {
    return (
      <div style={{textAlign: 'center', fontSize: 12, padding: 15}}>
        People online: {this.props.counter}
      </div>
    );
  }
}

export default connect(mapStateToProps)(Onlinecount);
