import React from 'react';
import { DragDropContext } from 'react-dnd';
import HTML5Backend from 'react-dnd-html5-backend';

class Board extends React.Component {

  static propTypes = {
    children: React.PropTypes.any
  }

  render () {
    const styles = {
      width: '100vmin',
      height: '100vmin'
    };

    return (
      <div style={styles}>
        {this.props.children}
      </div>
    );
  }
}

export default DragDropContext(HTML5Backend)(Board);
