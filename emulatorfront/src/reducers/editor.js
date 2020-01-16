const initalState = {
  code: "",
  run: false
}

const editor = (state = initalState, action) => {
  switch (action.type) {
    case 'EDITOR_CHANGE':
      return Object.assign({}, state, {code: action.code});
    case 'EDITOR_RUN':
      return Object.assign({}, state, {run: true});
    case 'EDITOR_STOP':
      return Object.assign({}, state, {run: false});  
    default:
      return state
  }
}
export default editor