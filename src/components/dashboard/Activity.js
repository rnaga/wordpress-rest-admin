import React from 'react';
import {compose} from 'recompose';
import moment from 'moment';
import Card from '@material-ui/core/Card'; 
import CardHeader from '@material-ui/core/CardHeader';
import CardContent from '@material-ui/core/CardContent';
import MuiList from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';  
import Typography from '@material-ui/core/Typography';
import Avatar from '@material-ui/core/Avatar';
import {DashboardCard, DashboardLink} from '../Dashboard';
import withHttp from '../../hoc/withHttp';
import withStyles from '../../hoc/withStyles';
import withWidth from '../../hoc/withWidth';
import httpNormalizeResponseBody from '../../util/httpNormalizeResponseBody';
import wpUrl, {wpUrlPosts} from '../../util/wpUrl';
import striptags from '../../util/striptags';
import adminUrl from '../../util/adminUrl';
import caches from '../../util/caches';

class Activity extends React.Component{

    constructor(props){
        super(props);

        this.posts = [];
        this.comments = [];
        this.pages = [];

        this.httpItems = this.httpItems.bind(this);

        this.state = {loading: true};

    }

    componentWillMount(){
        this.httpItems();

    }

    httpItems(){

        const {http} = this.props;
        const _self = this;
        
        var count = 3;

        http('_posts', {
            url: wpUrlPosts({per_page: 5}).url,
            method: 'GET',
            isProtected: true,
            onSuccess: (response) => {
                _self.posts = httpNormalizeResponseBody({response});
                if(0 >= --count)
                    _self.setState({loading: false});
            }
        });

        http('_pages', {
            url: wpUrl().path('pages').query({per_page: 5}).url,
            method: 'GET',
            isProtected: true,
            onSuccess: (response) => {
                _self.pages = httpNormalizeResponseBody({response});
                if(0 >= --count)
                    _self.setState({loading: false});
            }
        });

        http('_comments', {
            url: wpUrl().path('comments').query({per_page: 10}).url,
            method: 'GET',
            isProtected: true,
            onSuccess: (response) => {
                _self.comments = httpNormalizeResponseBody({response});
                if(0 >= --count)
                    _self.setState({loading: false});
            }
        });
    }

    render(){

        const {cssStyles, width, style = {}} = this.props;
        const account = caches('account');

        const recentlyPublished = [
          {label: 'Posts', list: this.posts, linkTo: adminUrl('posts', 'Edit').url, access: account.cap.edit_published_posts},
          {label: 'Pages', list: this.pages, linkTo: adminUrl('pages', 'Edit').url, access: account.cap.edit_published_pages},
        ];

        const xsOrSm = width === 'xs' || width === 'sm';

        return (
          <DashboardCard style={style} label='Activity' loading={this.state.loading}>
              <Typography 
                variant="title" 
                color="inherit" 
                style={{fontSize: '0.8rem', fontWeight: 550, paddingBottom: 10}}>
                Recently Published
              </Typography> 

              <div style={{display: 'flex', flexWrap: xsOrSm ? 'wrap' : 'nowrap'}} >
                {recentlyPublished.map( (item, i) => { return (
                <Card key={i} style={{width: xsOrSm ? '100%' : '50%', boxShadow: 'none', marginBottom: 0, backgroundColor: 'inherit'}}>
                  <CardHeader 
                    classes={{
                      title: cssStyles.dashboardPostsCardheaderTitle,
                      root: cssStyles.dashboardPostsCardheaderRoot,
                    }}            
                    title={item.label} />
                  <CardContent>
                    {item.list.map( (post, i) => {
                        return <div key={i}>
                        <Typography style={{display: 'inline', fontSize: '0.8rem', color: '#72777c', paddingRight: 10}}>
                          {moment(post.date).format('MMM DD')}th, {moment(post.date).format('hh:mm a')}
                        </Typography>
                        <DashboardLink to={`${item.linkTo}/${post.id}`} enable={item.access||false}>
                         {post.title.rendered}
                        </DashboardLink>
                    </div>})}
                  </CardContent>
                </Card>
                )})}
              </div>

              <Typography
                variant="title"
                color="inherit"
                style={{fontSize: '0.8rem', fontWeight: 550, paddingBottom: 10}}>
                Comments
                {account.cap.moderate_comments && (
                <DashboardLink to={adminUrl('comments').url} >
                  <span style={{float: 'right', fontWeight: 250}}>
                    View all comments
                  </span>
                </DashboardLink>)}
              </Typography>

              <MuiList>
              {this.comments.map( (comment, i) => {
                  return (
                    <ListItem key={i} style={{padding: '8px 0'}}> 
                      <Avatar alt={comment.author_name} src={comment.author_avatar_urls[24]} />
                      <ListItemText 
                        classes={{
                          primary: cssStyles.dashboardActivityListItemTextPrimary,
                          secondary: cssStyles.dashboardActivityListItemTextSecondary,
                        }}
                        style={{overflowWrap: 'break-word',}}
                        primary={`from ${comment.author_name}`} 
                        secondary={striptags(comment.content.rendered)} />
                    </ListItem>)
              })}
              </MuiList>
          </DashboardCard>);

    }
}

export default compose(
    withStyles,
    withHttp(),
    withWidth(),
)(Activity);

