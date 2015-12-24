import React from 'react';

export default class Board extends React.Component {

  static propTypes = {
    children: React.PropTypes.any
  }

  render () {
    const styles = {
      width: '600px',
      height: '600px',
      margin: 10
    };

    return (
      <div style={styles}>
        {this.props.children}
      </div>
    );
  }
}
