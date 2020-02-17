const initalState = {
}
  
const editor = (state = initalState, action) => {
    switch (action.type) {
        case 'MODAL_CHANGE_NAME':
            return Object.assign({}, state, {}); // !
        case 'MODAL_CHANGE_DESCRIPTIOM':
            return Object.assign({}, state, {}); // !
        case 'MODAL_SEND':
            return Object.assign({}, state, {}); // !
        case 'MODAL_SENT':
            return Object.assign({}, state, {}); // !
        case 'MODAL_SHOW':
            return Object.assign({}, state, {}); // !
        case 'MODAL_HIDE':
            return Object.assign({}, state, {}); // !
        default:
            return state
    }
}
export default editor