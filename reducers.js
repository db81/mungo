import { combineReducers } from 'redux'

function views(state = {}, action) {
    switch(action.type) {
    default:
        return state
    }
}

function collections(state = {}, action) {
    let col = action.collection
    switch(action.type) {
    case 'FILL_COLLECTIONS':
        return action.collections.reduce((acc, col) =>
            ({ ...acc, [col]: { ...state[col], stale: true } }), {})
    case 'FILL_COLLECTION':
        return { ...state, [col]: { stale: false, docs: action.docs } }
    case 'INVALIDATE_COLLECTION':
        return { ...state, [col]: { ...state[col], stale: true } }
    default:
        return state
    }
}

export default combineReducers({ views, collections })
