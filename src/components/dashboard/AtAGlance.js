import React from 'react';
import {compose} from 'recompose';
import {Link} from 'react-router-dom';
import MuiList from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import Grid from '@material-ui/core/Grid';
import {DashboardCard} from '../Dashboard';
import getIcon from '../../util/getIcon';
import withHttp from '../../hoc/withHttp';
import withStyles from '../../hoc/withStyles';
import httpGetHeaders from '../../util/httpGetHeaders';
import wpUrl from '../../util/wpUrl';
import adminUrl from '../../util/adminUrl';
import caches from '../../util/caches';

class AtAGlance extends React.Component{

    constructor(props){
        super(props);

        this.counts = {
            posts: 0,
            comments: 0,
            pages: 0,
            categories: 0,
            tags: 0,
        }

        this.httpItems = this.httpItems.bind(this);

        this.state = {loading: true};

    }

    componentWillMount(){
        this.httpItems();

    }

    httpItems(){

        const {http} = this.props;
        const _self = this;

        const paths = ['posts', 'pages', 'comments', 'categories', 'tags'];
        var count = paths.length;

        paths.forEach( path => {
            http(`_${path}`, {
                url: wpUrl().path(path).query({per_page: 1}).url,
                method: 'GET',
                isProtected: true,
                onSuccess: (response) => {
                    const headers = httpGetHeaders({response});
                    _self.counts[path] = parseInt(headers['x-wp-total'], 10);
                    if(0 >= --count)
                        _self.setState({loading: false});
                }
            });
        })
    }

    render(){

        const {cssStyles, style = {}} = this.props;
        const account = caches('account');
        const Folder = getIcon({iconName: 'Folder'});
        const LibraryBooks = getIcon({iconName: 'LibraryBooks'});
        const Message = getIcon({iconName: 'Message'});
        const ColorLens = getIcon({iconName: 'ColorLens'});
        const Label = getIcon({iconName: 'Label'});

        const atAGlanceList = [
          {icon: Folder,       linkTo: adminUrl('posts').url,      label: `${this.counts.posts} posts`,           access: account.cap.edit_posts},
          {icon: LibraryBooks, linkTo: adminUrl('pages').url,      label: `${this.counts.pages} pages`,           access: account.cap.edit_others_pages},
          {icon: Message,      linkTo: adminUrl('comments').url,   label: `${this.counts.comments} comments`,     access: account.cap.moderate_comments},         
          {icon: ColorLens,    linkTo: adminUrl('categories').url, label: `${this.counts.categories} categories`, access: account.cap.manage_categories},
          {icon: Label,        linkTo: adminUrl('tags').url,       label: `${this.counts.tags} tags`,             access: account.cap.manage_categories},
        ];

        return (
          <DashboardCard style={style} label='At a Glance' loading={this.state.loading}>

            <Grid item>
              <MuiList style={{display: 'flex', flexWrap: 'wrap'}}>

                {atAGlanceList.map( (item, i) => {

                    const Icon = item.icon;

                    return (
                      <ListItem 
                        key={i} 
                        component={item.access ? Link : 'div'}
                        to={item.linkTo}
                        button={item.access}
                        style={{width: 200}}>

                        <ListItemIcon style={{width: 20}}>
                          <Icon  />
                        </ListItemIcon>
                        <ListItemText
                          classes={{
                            primary: cssStyles.dashboardListItemText,
                          }}
                          primary={item.label}
                        />
                     </ListItem>
                    );
                })}

              </MuiList>
            </Grid>

          </DashboardCard>);
    }
}

export default compose(
    withStyles,
    withHttp(),
)(AtAGlance);

