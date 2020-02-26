const initalState = {
    name: '',
    description: '',
    author: '',
    sending: false,
    show: false,
}
  
const modal = (state = initalState, action) => {
    switch (action.type) {
        case 'MODAL_CHANGE_NAME':
            return Object.assign({}, state, { name: action.name });
        case 'MODAL_CHANGE_DESCRIPTION':
            return Object.assign({}, state, { description: action.description });
        case 'MODAL_CHANGE_AUTHOR':
            return Object.assign({}, state, { author: action.author });
        case 'MODAL_SEND':
            return Object.assign({}, state, { sending: true });
        case 'MODAL_SENT':
            return Object.assign({}, state, { sending: false });
        case 'MODAL_SHOW':
            return Object.assign({}, state, { show: true });
        case 'MODAL_HIDE':
            return Object.assign({}, state, { show: false });
        case 'MODAL_RESET':
            return Object.assign({}, state, { description: '', name: '', author: ''});
        default:
            return state
    }
}

export default modal