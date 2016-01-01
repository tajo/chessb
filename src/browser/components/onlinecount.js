import React from 'react';
import Component from 'react-pure-render/component';
import {connect} from 'react-redux';
import {Record} from 'immutable';

const mapStateToProps = (state) => ({
  meta: state.meta
});

class Onlinecount extends Component {

  static propTypes = {
    meta: React.PropTypes.instanceOf(Record).isRequired
  }

  render() {
    return (
      <div style={{textAlign: 'center'}}>
        Online players: {this.props.meta.get('onlinecount')}
      </div>
    );
  }
}

export default connect(mapStateToProps)(Onlinecount);
