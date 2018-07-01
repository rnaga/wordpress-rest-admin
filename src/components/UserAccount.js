import React from 'react';
import {withRouter} from 'react-router-dom';
import Typography from '@material-ui/core/Typography';
import Avatar from '@material-ui/core/Avatar';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';  
import ListItemText from '@material-ui/core/ListItemText'; 
import ListItemIcon from '@material-ui/core/ListItemIcon'; 
import Divider from '@material-ui/core/Divider';
import getIcon from '../util/getIcon';
import {compose} from 'recompose';
import moment from 'moment';
import Card from '@material-ui/core/Card'; 
import CardHeader from '@material-ui/core/CardHeader';
import CardContent from '@material-ui/core/CardContent';
import withAuth from '../hoc/withAuth';
import withSharedState, {ssNamespaces} from '../hoc/withSharedState';
import withStyles from '../hoc/withStyles';
import caches from '../util/caches';
import adminUrl from '../util/adminUrl';

class UserAccount extends React.Component {

    render(){

      const {open = false} = this.props.getSharedState();

      if(!open) 
          return null;

      const {cssStyles, logOut, history, setSharedState} = this.props;
      const account = caches('account');
      const user = account.get();
 
      const Edit = getIcon({iconName: 'Edit'});
      const LogOut = getIcon({iconName: 'PowerSettingsNew'});

      return (<div>
        <Card style={{float: 'right', width: 250}} >
          <CardHeader
            avatar={
              <Avatar aria-label="Recipe">
                <img src={user.avatar_urls['48']} alt='avatar' />
              </Avatar>
            }
            title={user.name}
            subheader={(<Typography color="textSecondary" style={{lineHeight: '1em'}}>
              <span style={{display: 'block', fontSize: 12}}> {user.email} </span>
              <span style={{display: 'block', fontSize: 10}}> joined {moment(user.registered_date).format('MMMM DD, YYYY')}</span>
            </Typography>)}
            classes={{subheader: cssStyles.accountSubHeader}}
          />
          <CardContent style={{flex: 1, padding: 5}} >
            <Divider />
            <List>
              <div onClick={() => {
                  history.push(adminUrl('profile').url);
                  setSharedState({open: false});
              }}>
              <ListItem button>
                <ListItemIcon>
                  <Edit />
                </ListItemIcon>
                <ListItemText primary="Edit My Profile" classes={{primary: cssStyles.accountContentListTextItem}} />
              </ListItem>
              </div>
              <li><Divider /></li>
              <div onClick={logOut}>
              <ListItem button>
                <ListItemIcon>
                  <LogOut />
                </ListItemIcon>
               <ListItemText primary="Log Out" classes={{primary: cssStyles.accountContentListTextItem}} />
              </ListItem>
              </div>
              <li><Divider /></li>
            </List>
           </CardContent>
        </Card>
      </div>);
    }
}

export default compose(
    withStyles,
    withRouter,
    withAuth(),
    withSharedState({namespace: ssNamespaces.useraccount}),
)(UserAccount);

