import React from 'react'
import { findDOMNode } from 'react-dom'
import GrowingTextarea from 'react-autosize-textarea'
import { connectProps } from 'components/utils'
import { addDocument, updateDocument } from 'actions'

let Doc = React.createClass({
    getFieldValue: function(field){
        let val = findDOMNode(this.refs[field]).value
        if (val === 'false' || val === 'true')
            return val === 'true'
        else if (parseFloat(val).toString() === val)
            return parseFloat(val)
        return val
    },
    getFieldValues: function(){
        return Object.keys(this.refs).reduce((acc, k) =>
            ({ ...acc, [k]: this.getFieldValue(k) }), {})
    },
    render: function(){
        return <dl className="document">
            {Object.keys(this.props.doc).filter(k => k[0] !== '_').map(k => [
                <dt key={'t'+k}>
                    <input type="text" defaultValue={k} placeholder="<key>" />
                </dt>,
                <dd key={'d'+k}>
                    <GrowingTextarea
                        ref={k}
                        style={{ resize: 'none' }}
                        defaultValue={this.props.doc[k]}
                        onChange={this.props.onChange}
                        placeholder="<value>"
                    />
                </dd>
            ])}
        </dl>
    }
})

export let DocCollection = connectProps(({ collections }, { params: { collection, id } }) =>
    ({ collection, doc: collections[collection].docs[id] }))
(React.createClass({
    getInitialState: () => ({ updateTimeout: null }),
    componentWillUpdate: function(nextProps) {
        if (this.props.doc !== nextProps.doc && this.props.doc._id === nextProps.doc._id) {
            // Update persisted on server. Re-persist if the doc has changed locally since then.
            // This is not strictly necessary, but is kept as a fallback.
            let vals = this.refs.doc.getFieldValues()
            if (!Object.keys(vals).every(k => vals[k] == nextProps.doc[k]))
                this.persistDocument()
        }
    },
    handleUpdateDoc: function() {
        this.persistDocument()
    },
    persistDocument: function() {
        if (this.state.updateTimeout)
            clearTimeout(this.state.updateTimeout)

        this.setState({ updateTimeout: setTimeout(() => {
            this.props.dispatch(updateDocument(this.props.collection,
                { _id: this.props.doc._id, ...this.refs.doc.getFieldValues() })).then(() =>
                this.setState({ updateTimeout: null }))
        }, 1000) })
    },
    handleClone: function() {
        this.props.dispatch(addDocument(this.props.collection,
            Object.keys(this.props.doc).reduce((acc, k) =>
            ({ ...acc, [k]: '' }), {})))
    },
    render: function(){
        // We set the key for the doc so that when we change docs it gets re-rendered
        // with new defaultValues for inputs. Otherwise the inputs will become stale.
        return <div className="docPane">
            <button onClick={this.handleClone}>Clone schema</button>
            <Doc
                ref="doc"
                key={this.props.doc._id}
                doc={this.props.doc}
                onChange={this.handleUpdateDoc}
            />
            {this.state.updateTimeout && <div className="saving">saving...</div>}
        </div>
    }
}))
