import { combineReducers } from 'redux'

function views(state = {}, action) {
    switch(action.type) {
    default:
        return state
    }
}

function collections(state = {}, action) {
    let col = action.collection
    let doc = action.doc
    switch(action.type) {
    case 'FILL_COLLECTIONS':
        return action.collections.reduce((acc, col) =>
            ({ ...acc, [col]: { ...state[col], stale: true } }), {})
    case 'FILL_COLLECTION':
        return { ...state, [col]: { stale: false, docs: action.docs.reduce((acc, d) =>
            ({ ...acc, [d._id]: d }), {}) } }
    case 'INVALIDATE_COLLECTION':
        return { ...state, [col]: { ...state[col], stale: true } }
    case 'UPDATE_DOCUMENT':
        return { ...state, [col]: { ...state[col], docs: { ...state[col].docs, [doc._id]: doc } } }
    case 'ADD_DOCUMENT': // this is a hack to get correct doc order for added docs
        return { ...state, [col]: { ...state[col], docs: { [doc._id]: doc, ...state[col].docs } } }
    default:
        return state
    }
}

export default combineReducers({ views, collections })
