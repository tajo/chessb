import React from 'react';
import Component from 'react-pure-render/component';
import '../styles/button.scss';

export default class Modal extends Component {

  static propTypes = {
    children: React.PropTypes.any.isRequired,
    closeModal: React.PropTypes.func
  };

  render() {
    return (
      <div>
        {this.props.children}
        <p><button className="pureButton" onClick={this.props.closeModal}>Close this</button></p>
      </div>
    );
  }

}
