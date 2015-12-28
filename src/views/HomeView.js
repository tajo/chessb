import React from 'react';
import Component from 'react-pure-render/component';
import Board from '../components/board';
import FreePieces from '../components/freePieces';
import {DragDropContext} from 'react-dnd';
import HTML5Backend from 'react-dnd-html5-backend';

export class HomeView extends Component {

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
        <div>
          <FreePieces />
          <Board board='aBoard' />
          <FreePieces />
        </div>
        <div>
          <FreePieces />
          <Board board='bBoard' />
          <FreePieces />
        </div>
      </div>
    );
  }
}

export default DragDropContext(HTML5Backend)(HomeView);
