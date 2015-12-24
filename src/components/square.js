import React from 'react';

export const COLORS = {
  BLACK: 'BLACK',
  WHITE: 'WHITE'
};

export default class Square extends React.Component {

  static propTypes = {
    children: React.PropTypes.object,
    color: React.PropTypes.string.isRequired
  }

  render () {
    const styles = {
      backgroundColor: this.props.color === COLORS.BLACK ? '#b58863' : '#f0d9b5',
      color: this.props.color === COLORS.WHITE ? '#b58863' : '#f0d9b5',
      width: '12.5%',
      height: '12.5%',
      display: 'inline-block'
    };

    return (
      <div style={styles}>
        {this.props.children}
      </div>
    );
  }
}
