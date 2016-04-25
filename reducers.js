import { combineReducers } from 'redux'

function docs(state = {}, action) {
    switch(action.type) {
    case 'ADD_DOCUMENT':
        return { [action.doc.id]: action.doc, ...state }
    default:
        return state
    }
}

export default combineReducers({ docs })
