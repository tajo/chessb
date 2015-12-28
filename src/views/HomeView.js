import React from 'react';
import Component from 'react-pure-render/component';
import {DragDropContext} from 'react-dnd';
import HTML5Backend from 'react-dnd-html5-backend';
import Desk from '../components/desk';

class HomeView extends Component {

  render () {
    const rootStyles = {
      display: 'flex',
      flexDirection: 'row',
      flexWrap: 'noWrap',
      height: '100vmin',
      width: '100%',
      justifyContent: 'center'
    };
    return (
      <div style={rootStyles}>
        <Desk board='aBoard' />
        <Desk board='bBoard' />
      </div>
    );
  }
}

export default DragDropContext(HTML5Backend)(HomeView);
