import React from 'react';
import {COLORS} from '../constants';
import {DropTarget} from 'react-dnd';

const squareTarget = {
  drop (props, monitor, component) {
    console.log(props);
    console.log(monitor.getItem());
  }
};

function collect (connect, monitor) {
  return {
    connectDropTarget: connect.dropTarget(),
    isOver: monitor.isOver()
  };
}

class Square extends React.Component {

  static propTypes = {
    children: React.PropTypes.object,
    color: React.PropTypes.string.isRequired,
    position: React.PropTypes.string.isRequired,
    isOver: React.PropTypes.bool.isRequired,
    connectDropTarget: React.PropTypes.func.isRequired
  }

  render () {
    const styles = {
      backgroundColor: this.props.color === COLORS.BLACK ? '#b58863' : '#f0d9b5',
      color: this.props.color === COLORS.WHITE ? '#b58863' : '#f0d9b5',
      width: '12.5%',
      height: '12.5%',
      float: 'left',
      border: this.props.isOver ? '3px solid black' : 'none'
    };

    return this.props.connectDropTarget(
      <div style={styles}>
        {this.props.children}
      </div>
    );
  }
}

export default DropTarget('piece', squareTarget, collect)(Square);
