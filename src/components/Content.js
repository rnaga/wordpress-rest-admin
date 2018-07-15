import React from 'react';
import PropTypes from 'prop-types';
import {withRouter, Switch, Route} from 'react-router-dom'
import {connect} from 'react-redux';
import {compose} from 'recompose';
import withStyles from '../hoc/withStyles';
import withContentToolbar from '../hoc/withContentToolbar';
import withSidebar from '../hoc/withSidebar';
import withWidth from '../hoc/withWidth';
import ContentToolbar from './ContentToolbar';
import {actions} from '../actions';

// Execute contents defined in './contents'
const Loader = content => compose(withRouter, connect(), withContentToolbar, withStyles,)(

    class extends React.Component{
         
        constructor(props){
            super(props);
            this.state = {key: null};
            this.reload = null;
        }

        componentWillMount(){

            const {history, dispatch, match: {params}, setContentToolbar} = this.props;
            const pageName = !params.pageName ? '_default' : params.pageName;

            dispatch(actions.currentContent({pageName, content}));
            setContentToolbar(null);

            const _self = this;

            this.unlisten = history.listen((location, action) => {
                const {contentName, pageName = '_default',} = content.rePath(location.pathname);

                if(contentName){
                    dispatch(actions.currentContent({pageName, content}));
                    setContentToolbar(null);
                }

                _self._reload(location);
            });

            this.setState({key: Math.random});

        }

        componentWillUnmount(){
            // Remove event listener
            this.unlisten();
        }

        _reload(location){

            this.setState({key: Math.random()});

            if(typeof this.reload === 'function')
                this.reload(location);
        }

        setContentReload(reload){
            this.reload = reload;
        }

        render(){
   
            const {match: {params}, cssStyles} = this.props;
            const pageName = !params.pageName ? '_default' : params.pageName;
            const {routes} = content;
            const WrappedComponent = routes[pageName].component

            if(!WrappedComponent)
                return (<div>Page Not Found</div>);

            return (<div className={cssStyles.toolbar} >
            <ContentToolbar content={content} pageName={pageName} />
            <WrappedComponent
              key={this.state.key}
              {...this.props}
              _basePath={content.basePath}
              __content={content}
              setContentReload={this.setContentReload.bind(this)}
              __reloadContent={this._reload.bind(this)}
            /></div>);
        }
});


class Content extends React.Component {

    componentWillMount(){
        const {cssStyles} = this.props;
        const {contents, defaultContent} = this.context;

        // Define the element for content here 
        // to prevent re-rendering from window resize, nav expansion/collapsing
        this.contentBody = (<div>
              <div className={cssStyles.toolbar} />
              <Switch>
                <Route exact path="/" component={Loader(defaultContent)} />
                {contents && Object.entries(contents).map( (contentKey, i) => { 
                    const [, content] = contentKey;
                    return (<Route key={i} path={content.pagePath} component={Loader(content)}/>);
                })}
              </Switch>
        </div>);
    }

    render(){

        const {cssStyles, width, isSidebarCollapse} = this.props;
  
        let style = {padding: '24px'};

        if(width !== 'xs'){
            style = !isSidebarCollapse()
                  ? {padding: '24px 24px 24px 200px',}
                  : {padding: '24px 24px 24px 80px',};
        }
 
        return (
            <main className={cssStyles.content} style={style}>
              {this.contentBody}
            </main>
        );

    }
}

Content.contextTypes = {
    contents: PropTypes.object,
    defaultContent: PropTypes.object,
};

export default compose(
    withRouter,
    withSidebar,
    withWidth(),
    withStyles,
)(Content);



