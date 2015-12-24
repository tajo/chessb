export const COUNTER_INCREMENT = 'COUNTER_INCREMENT';
export const COUNTER_DOUBLE_INCREMENT = 'COUNTER_DOUBLE_INCREMENT';
export const COUNTER_DOUBLE_INCREMENT_SUCCESS = 'COUNTER_DOUBLE_INCREMENT_SUCCESS';

export const actions = {
  increment,
  doubleAsync
};

export function increment () {
  return {
    type: COUNTER_INCREMENT
  };
}

const timeout = (interval) => new Promise((resolve) => setTimeout(resolve, interval || 0));
export function doubleAsync () {
  return {
    type: COUNTER_DOUBLE_INCREMENT,
    payload: {
      promise: timeout(1000)
    }
  };
}
