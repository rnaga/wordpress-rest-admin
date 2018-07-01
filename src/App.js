import React from 'react';
import PropTypes from 'prop-types';
import {connect} from 'react-redux';
import {compose} from 'recompose';
import {withRouter} from 'react-router-dom';
import {withStyles} from '@material-ui/core/styles';
import styles from './styles';
import withAuth from './hoc/withAuth';
import withAdmin from './hoc/withAdmin';
import Confirm from './components/Confirm';
import FullscreenLoading from './components/FullscreenLoading';
import Snackbar from './components/Snackbar';
import DialogForm from './components/DialogForm';
import Nav from './components/Nav';
import Header from './components/Header';
import Content from './components/Content';
import Login from './components/Login';
import ClickAway from './containers/ClickAway';
import Width from './containers/Width';
import Errorbars from './components/Errorbars';
import contents, {defaultContent} from './contents';

import loginLogo from './WordpressLogo.svg';
import headerLogo from './WordpressLogo.png';

class App extends React.Component {

    getChildContext() {

        return {
            // CSS styles
            classes: this.props.classes,
            store: this.props.store,
            location: this.props.location,
            history: this.props.history,
            contents: this.props.contents || contents,
            defaultContent: this.props.defaultContent || defaultContent,
            staticFiles: {
                loginLogo: this.props.loginLogo || loginLogo,
                headerLogo: this.props.headerLogo || headerLogo,
            }
        };
    }

    componentDidMount(){

        const {isAuthed, initAdmin} = this.props;

        // Get user account, site info
        if(isAuthed())
            initAdmin();
    }

    render(){
       
        const {classes, admin, isAuthed} = this.props;
      
        return (
          <div className={classes.root}>

            <Width />
            <FullscreenLoading />
            <Snackbar />
            <Errorbars />
            <Confirm />
            <DialogForm />
            <ClickAway />

            {(() => {

                // Redirect to login page
                if(!isAuthed())
                    return <Login />;

                // Logging in, waiting to finish initAdmin()
                if(admin.status !== 'success')
                    return <div>Loading...</div>;
    
                return [
                    <Header key="header" />,
                    <Nav key="nav" />,
                    <Content key="content" />,
                ];

            })()}
          </div>
        );
    }
}

App.childContextTypes = {
    classes: PropTypes.object,
    store: PropTypes.object,
    location: PropTypes.object,
    history: PropTypes.object,
    contents: PropTypes.object,
    defaultContent: PropTypes.object,
    staticFiles: PropTypes.object,
};

App.propTypes = {
    classes: PropTypes.object.isRequired,
};

const mapStateToProps = (state, ownProps) => ({
    admin: state.admin,
})

export default compose(
    withRouter,
    withAdmin,
    withStyles(styles, { withTheme: true }),
    withAuth({passAuth: true}),
    connect(mapStateToProps),
)(App);
