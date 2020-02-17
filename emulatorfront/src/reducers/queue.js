const initalState = {
    queue: []
}

const queue = (state = initalState, action) => {
    switch (action.type) {
        case 'QUEUE_CHANGE':
            return Object.assign({}, state, { queue: action.queue });
        default:
            return state
    }
}

export default queue