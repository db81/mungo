import React from 'react'
import { Router, Route, Link, browserHistory } from 'react-router'
import { connect } from 'react-redux'
import { fillCollections, fillCollection } from 'actions'

// A version of connect for picking state based on props.
let connectProps = (f => connect(x => x, dispatch => ({ dispatch }),
    (state, d, props) => ({ ...d, ...f(state, props) })))

let StoreState = connect(store => ({store}))(props =>
    <pre className="storeState">{JSON.stringify(props.store, null, 2)}</pre>)

let Doc = ({doc}) =>
    <dl className="document">
        {Object.keys(doc).filter(k => k[0] !== '_').map(k => [
            <dt key={'t'+k}>{k}</dt>,
            <dd key={'d'+k}>{doc[k]}</dd>
        ])}
    </dl>

let DocCollection = connectProps(({ collections }, { params: { collection, id } }) =>
    ({ collection, doc: collections[collection].docs[id] }))
(React.createClass({
    render: function(){
        console.log('asdf')
        return <Doc doc={this.props.doc} />
    }
}))

let Index = connect(({ collections }) => ({ collections: Object.keys(collections) }))
(React.createClass({
    render: function(){
        return <div className="index">
            <h1>Mungo</h1>
            <h2>Collections</h2>
            {this.props.collections.map(col =>
                <Link
                    activeClassName="active"
                    key={col}
                    to={'/collections/' + col}>
                    {col}
                </Link>
            )}
            {this.props.children}
        </div>
    }
}))

function View(props) {
    return <p>View {props.params.view}. <Link to="/">Back</Link>.</p>
}

// A span that decreases font size if the text is too long.
let ShrinkingSpan = ({ text }) => {
    let size = '1.0em'
    if (text.length > 65) size = '0.8em'
    else if (text.length > 100) size = '0.6em'
    return <span style={{ fontSize: size }}>
        {text}
    </span>
}

let Collection = connectProps(({ collections }, { params: { collection } }) =>
    ({ collection: collections[collection], name: collection }))
(React.createClass({
    componentDidMount: function(){
        if (this.props.collection.stale)
            this.props.dispatch(fillCollection(this.props.name))
    },
    componentWillUpdate: function(nextProps){
        if (this.props.name !== nextProps.name && nextProps.collection.stale)
            this.props.dispatch(fillCollection(nextProps.name))
    },
    render: function(){
        return <div className="collection">
            {Object.values(this.props.collection.docs || {}).map(d =>
                <Link
                    activeClassName="active"
                    key={d._id}
                    to={`/collections/${this.props.name}/${d._id}`}>
                    <ShrinkingSpan text={d.name || d._id} />
                </Link>
            )}
            {this.props.children}
        </div>
    }
}))

export let AppRoutes =
    <Router history={browserHistory}>
        <Route path="/" component={Index}>
            <Route path="views/:view" component={View} />
            <Route path="collections/:collection" component={Collection}>
                <Route path=":id" component={DocCollection} />
            </Route>
        </Route>
    </Router>
