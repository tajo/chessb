import React from 'react';

export default class Board extends React.Component {

  static propTypes = {
    children: React.PropTypes.any
  }

  render () {
    const styles = {
      width: '800px',
      height: '800px',
      border: '3px solid black'
    };

    return (
      <div style={styles}>
        {this.props.children}
      </div>
    );
  }
}
