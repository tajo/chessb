import React from 'react';
import Component from 'react-pure-render/component';
import {DragDropContext} from 'react-dnd';
import HTML5Backend from 'react-dnd-html5-backend';
import Desk from '../components/desk';
import io from 'socket.io-client';

class HomeView extends Component {

  componentDidMount() {
    const socket = io();
    socket.on('news', (data) => {
      console.log(data);
      socket.emit('my other event', {my: 'dataaa'});
    });
  }

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
      <div style={rootStyles}>
        <Desk board="aBoard" />
        <Desk board="bBoard" />
      </div>
    );
  }
}

export default DragDropContext(HTML5Backend)(HomeView);
