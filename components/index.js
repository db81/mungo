import React from 'react'
import { Router, Route, Link, browserHistory } from 'react-router'
import { connect } from 'react-redux'
import { fillCollections, fillCollection } from 'actions'
import { connectProps } from 'components/utils'
import { DocCollection } from 'components/document'
import { Scrollbars } from 'react-custom-scrollbars'


let StoreState = connect(store => ({store}))(props =>
    <pre className="storeState">{JSON.stringify(props.store, null, 2)}</pre>)

let Index = connect(({ collections }) => ({ collections: Object.keys(collections) }))
(React.createClass({
    render: function(){
        return <div className="index">
            <h1>Mungo</h1>
            <h2>Views</h2>
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

let ShrinkingSpan = ({ text }) => {
    let size = '1.0em'
    if (text.length > 100) size = '0.6em'
    else if (text.length > 65) size = '0.8em'
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
            <Scrollbars universal style={{ width: '100%', height: '100%' }} autoHide={true}>
            {Object.values(this.props.collection.docs || {}).map(d =>
                <Link
                    activeClassName="active"
                    key={d._id}
                    to={`/collections/${this.props.name}/${d._id}`}>
                    <ShrinkingSpan text={d.Name || d.name || d.Title || d.title || `<${d._id}>`} />
                </Link>
            )}
            </Scrollbars>
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
