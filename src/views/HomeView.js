import React from 'react';
import Component from 'react-pure-render/component';
import Board from '../components/board';

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
        <Board board='aBoard' />
        <Board board='bBoard' />
      </div>
    );
  }
}

export default HomeView;
