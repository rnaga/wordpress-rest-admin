import React from 'react';
import {compose} from 'recompose';
import moment from 'moment';
import TableList, {
    TableListItem, 
    TableListReferenceItem, 
    TableListHead, 
    TableListHeadItem} from '../../components/TableList';
import withStyles from '../../hoc/withStyles';
import withHttp from '../../hoc/withHttp';
import withPost from '../../hoc/contents/withPost';
import withTableList from '../../hoc/contents/withTableList';
import wpUrl, {wpUrlPosts} from '../../util/wpUrl';
import adminUrl from '../../util/adminUrl';
import IconActionButton from '../../components/IconActionButton';
import caches from '../../util/caches';

class List extends React.Component{

    constructor(props){
        super(props);
        this.httpItems = this.httpItems.bind(this);
        this.httpReferences = this.httpReferences.bind(this);
    }

    componentWillMount(){

        const {post, list} = this.props;

        post.bind(this);
        list.bind(this, {
            httpList: this.httpItems,
            pageArgs: {
                context: 'edit',
                per_page: 5,
                page: 1,
                status: 'publish,future,draft,pending,private',
                orderby: 'date',
                order: 'desc',
            },
            addNewButton: {
                redirect: () => adminUrl('posts', 'Create').url
            }
        });
    }

    httpReferences({resourceName, Ids, referenceName = null, httpQuery = {}, options = {}}){

        if(!referenceName)
            referenceName = resourceName;

        const {http} = this.props;
        const {parseHttpResponse, updateReferenceItems} = this.list;

        if(0 >= Ids.length){
            updateReferenceItems({[resourceName]: []});
            return;
        }

        httpQuery = {...httpQuery, include: Ids.join(',')};

        http(`_${referenceName}`, {
            url: wpUrl().path(resourceName).query(httpQuery).url,
            method: 'GET',
            onSuccess: response => {
                const {items} = parseHttpResponse(response);
                updateReferenceItems({[referenceName]: items});
            },
            ...options
        });
    }

    httpItems(){

        const {http} = this.props;
        const {parseHttpResponse, resetItems, updateItems} = this.list;
        const account = caches('account');

        resetItems();

        http('_items', {
            url: wpUrlPosts(this.list.pageArgs).url, 
            method: 'GET',
            isProtected: true,
            onSuccess: (response) => {

                const {items, itemsCount} = parseHttpResponse(response);

                updateItems({items, itemsCount});

                var categoryIds = [];
                var authorIds = [];
                var tagIds = [];

                items.forEach( item => {
                    categoryIds = [...categoryIds, ...item.categories];
                    tagIds = [...tagIds, ...item.tags];
                    authorIds.push(item.author);
                });

                this.httpReferences({
                    resourceName: 'categories', 
                    Ids: categoryIds,
                });

                this.httpReferences({
                    resourceName: 'tags', 
                    Ids: tagIds,
                });

                account.role === 'administrator' && this.httpReferences({
                    resourceName: 'users', 
                    Ids: authorIds, 
                    referenceName: 'authors', 
                    httpQuery: {context: 'edit'}, 
                    options: {isProtected: true},
                });
            }
        });
    }

    render(){

        const post = this.post;
        const {_location: location, 
               reload, 
               sort, 
               searchbox, 
               tablelistProps,
               _items: {references}} = this.list;

        const hidden = ['xs'];

        return (
        <div>
        {searchbox()}
        <TableList {...(tablelistProps())} >
          <TableListHead>
            <TableListHeadItem sort={sort('title')}>Title</TableListHeadItem>
            <TableListHeadItem hidden={hidden} adminOnly sort={sort('author')}>Author</TableListHeadItem>
            <TableListHeadItem hidden={hidden}>Categories</TableListHeadItem>
            <TableListHeadItem hidden={hidden}>Tags</TableListHeadItem>
            <TableListHeadItem sort={sort('date')}>Date</TableListHeadItem>
            <TableListHeadItem></TableListHeadItem>
          </TableListHead>

            <TableListItem 
              width={180}
              itemKey='title' 
              filter={v => v.rendered} 
            />

            <TableListReferenceItem 
              adminOnly
              itemKey='author' 
              references={references.authors} 
              refKey='id'
              hidden={hidden}
              filter={v => v.name}
            />

            <TableListReferenceItem 
              itemKey='categories' 
              hidden={hidden} 
              references={references.categories} 
              refKey='id'
              filter={v => v.name}
              type='array'
            />
          
            <TableListReferenceItem 
              itemKey='tags' 
              references={references.tags} 
              refKey='id' 
              hidden={hidden}
              filter={v => v.name}
              type='array'
            />

            <TableListItem 
              itemKey='date'
              filter={v =>  moment(v).format('MMMM DD, YYYY')}
            />

          <TableListItem 
            type='component'
            component={ itemValue => {
                return (<div>
                  {post.canEdit(itemValue) && (
                    <IconActionButton
                      type='edit'
                      redirect={() => `posts/Edit/${itemValue.id}`} />
                  )}
                  {post.canDelete(itemValue) && (
                    <IconActionButton
                      type='delete'
                      onClick={() => 
                          post.handleDelete({
                              postId: itemValue.id, 
                              after: () => reload(location),
                          })
                      }
                    />
                  )}
                </div>);
            }} 
          />

        </TableList>
        </div>);

    }
}

export default compose(
  withPost({namespace: 'post'}),
  withTableList({namespace: 'list'}),
  withStyles,
  withHttp(),
)(List);

