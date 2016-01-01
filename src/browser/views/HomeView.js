import React from 'react';
import Component from 'react-pure-render/component';
import {DragDropContext} from 'react-dnd';
import HTML5Backend from 'react-dnd-html5-backend';
import Desk from '../components/desk';
import Onlinecount from '../components/onlinecount';

class HomeView extends Component {

  render() {
    const rootStyles = {
      display: 'flex',
      flexDirection: 'row',
      flexWrap: 'noWrap',
      width: '100%',
      paddingTop: 10,
      justifyContent: 'center'
    };
    return (
      <div>
        <div style={rootStyles}>
          <Desk board="aBoard" />
          <Desk board="bBoard" />
        </div>
        <Onlinecount />
      </div>
    );
  }
}

export default DragDropContext(HTML5Backend)(HomeView);
