import fetch from 'isomorphic-fetch'

let apiPrefix = 'http://localhost:8080/api'

export function fillCollections() {
    return (dispatch) => {
        return fetch(apiPrefix + '/collections').then(res => res.json()).then(res => {
            dispatch({
                type: 'FILL_COLLECTIONS',
                collections: res,
            })
        })
    }
}

export function fillCollection(collection) {
    return (dispatch) => {
        return fetch(apiPrefix + '/collections/' + collection).then(res => res.json()).then(res => {
            dispatch({
                type: 'FILL_COLLECTION',
                collection,
                docs: res
            })
        })
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
