import React from 'react';
import Component from 'react-pure-render/component';
import Board from '../components/board';

export class HomeView extends Component {

  render () {
    return (
      <div className='container text-center'>
        <Board board='aBoard' />
      </div>
    );
  }
}

export default HomeView;
