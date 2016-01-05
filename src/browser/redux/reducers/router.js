export default function gameReducer(state = null, action) {
  switch (action.type) {
    case 'JOIN_GAME': {
      console.log('tada');
      console.log(state);
    }
  }
  return state;
}
