import React from 'react';
import PropTypes from 'prop-types';
import withStyles from '../hoc/withStyles';
import withSidebar from '../hoc/withSidebar';
import withClickAway from '../hoc/withClickAway';
import withSharedState, {ssNamespaces} from '../hoc/withSharedState';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import Hidden from '@material-ui/core/Hidden';
import IconButton from '@material-ui/core/IconButton';
import MenuIcon from '@material-ui/icons/Menu';
import Button from '@material-ui/core/Button';
import getIcon from '../util/getIcon';
import {compose} from 'recompose';
import UserAccount from './UserAccount';
import caches from '../util/caches';

class Header extends React.Component {

    constructor(props){
        super(props);
        this._refs = [];
    }

    componentDidMount(){

        const {setClickAway, getSharedState, setSharedState} = this.props;

        setClickAway({
            onClickAway: () => {
                const {open = false} = getSharedState();
                open && setSharedState({open: false});
            }
        });
    }

    render(){

        const {cssStyles, handleSidebarToggle, getSharedState, setSharedState, setClickAway} = this.props;
        const site = caches('site'); 
        const Person = getIcon({iconName: 'Person'});
    
        const {open = false} = getSharedState();
        const {headerLogo} = this.context.staticFiles;

        return (<div>
            <AppBar position="absolute" classes={{colorPrimary: cssStyles.appBar}} >
              <Toolbar className={cssStyles.headerToolbar} >
                <Hidden smUp>
                  <IconButton onClick={handleSidebarToggle} style={{color: 'rgb(220, 220, 220)'}}>
                    <MenuIcon />
                  </IconButton>
                </Hidden> 
                <Typography variant="title" color="inherit" noWrap>
                  <img src={headerLogo} style={{width: '50px', height: '50px'}} alt='wp-logo'/>
                </Typography>
                <Typography variant="title" color="inherit" noWrap>
                  <span style={{padding: '10px', color: '#DCDCDC'}}>{site.get()['name']}</span>
                </Typography>
    
                <Typography variant="title" color="inherit" noWrap style={{flex: 1, position: 'relative', overflow: 'visible'}}>
    
                  <Button 
                    classes={{root: cssStyles.headerAccountButton}} 
                    variant="fab" 
                    color="inherit" 
                    aria-label="account" 
                    mini 
                    style={{float: 'right'}} 
                    onClick={e => setSharedState({open: !open})} 
                    ref={ref => setClickAway({ref, i: 0})}
                  >
                    <Person style={{fill: 'black', padding: '10px', position: 'absolute'}}/>
                  </Button>
    
                  <div style={{float: 'right', position: 'relative'}}> 
                    <div className={cssStyles.userAccount} >
                      <UserAccount ref={ref => setClickAway({ref, i: 1})} />
                    </div>
                  </div>
    
                </Typography>
              </Toolbar>
    
            </AppBar>
        </div>);
    }
}

Header.contextTypes = {
    staticFiles: PropTypes.object,
};

export default compose(
    withClickAway({key: '_header'}),
    withStyles,
    withSidebar,
    withSharedState({namespace: ssNamespaces.useraccount}),
)(Header);
