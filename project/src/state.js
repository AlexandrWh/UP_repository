let state = {

};

export function getState() {
  return state;
}

export function setState(stateUpdate) {
  state = Object.assign(state, stateUpdate);
}
