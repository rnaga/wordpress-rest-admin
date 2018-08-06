import React from 'react';
import PropTypes from 'prop-types';
import {withRouter} from 'react-router-dom';
import Drawer from '@material-ui/core/Drawer';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import Collapse from '@material-ui/core/Collapse';
import Tooltip from '@material-ui/core/Tooltip';
import getIcon from '../util/getIcon';
import withSharedState, {ssNamespaces} from '../hoc/withSharedState';
import withStyles from '../hoc/withStyles';
import withSidebar from '../hoc/withSidebar';
import withCurrentContent from '../hoc/withCurrentContent';
import withAuth from '../hoc/withAuth';
import withWidth from '../hoc/withWidth';
import {compose} from 'recompose';

class ListItemButton extends React.Component{ 

    constructor(props){
        super(props);
        this._id = props.id;
    }

    render(){

        const {icon, 
               label, 
               cssStyles,
               enableLabel = true,
               children = null,
               classes: _classes,
               listItemChildren = null,
               width,
               getSharedState,
               isSidebarCollapse,
               currentContent,
               onClick, 
               style = {},
               noPadding = false,
         } = this.props;
   
        const classes = _classes || {primary: cssStyles.listItemText};
        const Icon = getIcon({iconName: icon});
        const collapse = isSidebarCollapse();
        const iconStyle = {color: '#F6F6F6'};
    
        const {id: currentId} = getSharedState();

        const classesListItem = (collapse && currentContent.content && currentContent.content.label === label) || 
                                (!collapse && typeof currentId === 'number' && currentId === this._id )
                              ? cssStyles.listItemCurrent : cssStyles.listItem;

        return (
        <List 
          component="nav" 
          classes={{padding: noPadding ? cssStyles.listItemNoPadding : cssStyles.listItemPadding }} 
        >
          <ListItem 
            button 
            onClick={onClick}
            style={{...style, ...{padding: noPadding ? '12px 16px' : '8px 16px', width: collapse ? 56 : 171}}} 
            classes={{root: classesListItem}} >
            <ListItemIcon className={cssStyles.listItemIcon}>
               {!enableLabel && width !== 'xs' ? (
               <Tooltip
                 id="tooltip-right"
                 title={label}
                 placement="right"
                 classes={{tooltip: cssStyles.drawerTooltip}}>
                 <Icon style={iconStyle} />
              </Tooltip>) : (<Icon style={iconStyle} />)}
            </ListItemIcon>
    
            {enableLabel && (
              <ListItemText
                inset 
                primary={label}
                classes={classes}
              />
            )}
    
            {listItemChildren}
    
          </ListItem>
          {children}
        </List>);
    }
}

ListItemButton = compose(
    withStyles,
    withWidth(),
    withAuth(),
    withSidebar,
    withCurrentContent,
    withSharedState({namespace: ssNamespaces.sidebaritem}),
)(ListItemButton);

class ListItems extends React.Component {

    constructor(props){
        super(props);
        this.state = {
            submenu: {},
        }
        this.handleClickSubMenu = this.handleClickSubMenu.bind(this);
    }

    handleClickSubMenu(i){
        const {submenu} = this.state;
        var currState = submenu[i] || false;
        this.setState({submenu: Object.assign({}, submenu, {[i]: !currState})});
    }

    handleClick(content, i){

        const {history, setSharedState} = this.props;
        const collapse = this.props.isSidebarCollapse(); //this.state;
        const {subMenus, contentBasePath} = content;
        const hasSubmenus = Array.isArray(subMenus);

        if(!hasSubmenus || collapse){
            history.push(contentBasePath);
            setSharedState({id: i});
        }

        this.handleClickSubMenu(i);
    }

    render(){
  
        const {contents} = this.context;
        const {history, 
               width, 
               handleSidebarToggle,
               isSidebarCollapse,
               setSharedState,
               handleSidebarCollapse} = this.props;

        const collapse = isSidebarCollapse();
        const ExpandLess = getIcon({iconName: 'ExpandLess'});
        const ExpandMore = getIcon({iconName: 'ExpandMore'});

        const iconStyle = {color: '#F6F6F6'}

        return (
          <div>
            <div style={{height: width === 'xs' ? '20px' : '90px'}} />
            {contents && Object.entries(contents).length > 0 && Object.entries(contents).map( (contentKey, i) => {

             const [key, content] = contentKey;

             const {subMenus, label, icon} = content;

             const hasSubmenus = Array.isArray(subMenus);
             const navProps = content.navProps || {};

             const hideMenu = navProps.hideMenu || [];

             if( (collapse && hideMenu.includes('icons')) || 
                 (!collapse && hideMenu.includes('full')) )

                 return null; 

             return (
               <ListItemButton
                 key={key}
                 id={i}
                 icon={icon} 
                 label={label}
                 enableLabel={!collapse}
                 onClick={() => {
                     width === 'xs' && collapse && handleSidebarToggle();
                     this.handleClick(content, i)
                 }}
                 listItemChildren={!collapse && hasSubmenus && (this.state.submenu[i] 
                   ? <ExpandLess style={iconStyle} /> 
                   : <ExpandMore style={iconStyle} />
                 )} 
                 {...navProps}
               >

               {hasSubmenus && !collapse && (
                 <Collapse 
                   in={this.state.submenu[i]} 
                   timeout="auto" 
                   unmountOnExit>
                       
                  {subMenus.map( (subMenu, j) => {

                    const navProps = subMenu.navProps || {};

                    return (
                      <ListItemButton
                        key={j}
                        icon="ChevronRight"
                        label={subMenu.label}
                        onClick={() => {
                            width === 'xs' && handleSidebarToggle();
                            history.push(subMenu.linkTo);
                            setSharedState({id: i});
                        }}
                        {...navProps}
                      />)
                   })}
                </Collapse>)}

              </ListItemButton>)})}

              <div style={{height: 56}} />

              <div style={{
                position: 'fixed', 
                bottom: 0, 
                left: 0, 
                zIndex: 1201, 
                borderTop: '1px solid rgb(246, 246, 246)', 
                backgroundColor: '#2C303B'}} >
              
                <ListItemButton
                  noPadding={true}
                  style={{width: '100%'}}
                  icon={collapse ? 'ArrowForward' : 'ArrowBack'}
                  label="Collapse"
                  enableLabel={!collapse}
                  onClick={e => handleSidebarCollapse(!collapse)}
                />
             </div>

          </div>);
    }
}

ListItems.contextTypes = {
    contents: PropTypes.object,
};

class Nav extends React.Component {

    render(){
       
        const {cssStyles, isSidebarOpen, handleSidebarToggle, width} = this.props;
        const key = (isSidebarOpen || !this.key) ? Math.random() : this.key;

        this.key = key;

        return (
        <div style={{backgroundColor: '#2C303B'}}>
            {width === 'xs' && (
            <Drawer 
              key={key}
              variant="temporary"
              onClose={handleSidebarToggle}
              open={isSidebarOpen}
              classes={{
                paper: cssStyles.drawerPaperXs,
              }}
            >

              <ListItems {...this.props} />
            </Drawer>
            )}

            {width !== 'xs' && (<div style={{position: 'fixed'}}>
            <Drawer
              variant="permanent"
              classes={{
                paper: cssStyles.drawerPaper,
              }}
            >
              <ListItems {...this.props} />
            </Drawer>
            </div>)}
        </div>);
    }
}

Nav.propTypes = {
    cssStyles: PropTypes.object.isRequired,
};

export default compose(
    withRouter,
    withWidth(),
    withStyles,
    withSidebar,
    withCurrentContent,
    withSharedState({namespace: ssNamespaces.sidebaritem}),
)(Nav);
