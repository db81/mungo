import fetch from 'isomorphic-fetch'

let apiPrefix = 'http://localhost:8080/api'

export function fillCollection(collection) {
    return (dispatch) => {
        return fetch(apiPrefix + '/collections/' + collection).then(res => res.json()).then(res => {
            dispatch({
                type: 'FILL_COLLECTION',
                collection,
                docs: res
            })
        }).catch(err => {})
    }
}

export function fillView(view) {
}

export function invalidateCollection(collection) {
    return {
        type: 'INVALIDATE_COLLECTION',
        collection
    }
}
