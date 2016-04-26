export function addDocument(collection, doc) {
    return {
        type: 'ADD_DOCUMENT',
        collection,
        doc
    }
}

export function fillCollection(collection) {
}

export function fillView(view) {
}
