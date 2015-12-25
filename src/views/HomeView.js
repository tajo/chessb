import React from 'react';
import Board from '../components/board';

export class HomeView extends React.Component {

  render () {
    return (
      <div className='container text-center'>
        <Board board='aBoard' />
      </div>
    );
  }
}

export default HomeView;
