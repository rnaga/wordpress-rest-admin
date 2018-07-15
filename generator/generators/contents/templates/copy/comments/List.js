import React from 'react';
import {compose} from 'recompose';
import moment from 'moment';
import TableList, {
  TableListItem, 
  TableListReferenceItem,
  TableListHead, 
  TableListHeadItem} from 'wordpress-rest-admin/components/TableList';
import withTableList from 'wordpress-rest-admin/hoc/contents/withTableList';
import withComment from 'wordpress-rest-admin/hoc/contents/withComment';
import withHttp from 'wordpress-rest-admin/hoc/withHttp';
import withStyles from 'wordpress-rest-admin/hoc/withStyles';
import wpUrl from 'wordpress-rest-admin/util/wpUrl';
import striptags from 'wordpress-rest-admin/util/striptags';
import IconActionButton from 'wordpress-rest-admin/components/IconActionButton';

class List extends React.Component{

    constructor(props){
        super(props);
        this.httpItems = this.httpItems.bind(this);
    }

    componentWillMount(){

        const {list, comment} = this.props;

        list.bind(this, {
            httpList: this.httpItems,
            pageArgs: {
                per_page: 5,
                page: 1,
                orderby: 'id',
                order: 'desc',
                status: 'any',
                context: 'edit',
            }
        });

        comment.bind(this);

    }

    httpItems(){

        const {http} = this.props;

        const {
            parseHttpResponse, 
            resetItems, 
            updateItems, 
            updateReferenceItems, 
            pageArgs
        } = this.list;

        resetItems();

        http('_items', {
            url: wpUrl().path('comments').query(pageArgs).url, 
            method: 'GET',
            isProtected: true,
            onSuccess: (response) => {

                const {items, itemsCount} = parseHttpResponse(response);

                updateItems({items, itemsCount});

                var postIds = [];

                items.forEach( item => {
                    postIds.push(item.post);
                });

                http('_posts', {
                    url: wpUrl().path('posts').query({include: postIds.join(',')}).url,
                    method: 'GET',
                    onSuccess: response => {
                        const {items: posts} = parseHttpResponse(response);
                        updateReferenceItems({posts});
                    }
                });
            }
        });
    }

    render(){

        const {sort, searchbox, tablelistProps, _items: {/*items,*/ references}} = this.list;

        return (
        <div>
        {searchbox()}
        <TableList {...(tablelistProps())} >
          <TableListHead>
            <TableListHeadItem sort={sort('author')}>Author</TableListHeadItem>
            <TableListHeadItem>Comment</TableListHeadItem>
            <TableListHeadItem sort={sort('post')}>In Response To</TableListHeadItem>
            <TableListHeadItem >Date</TableListHeadItem>
            <TableListHeadItem >Approved</TableListHeadItem>
            <TableListHeadItem></TableListHeadItem>
          </TableListHead>

          <TableListItem itemKey='author_name' />

          <TableListItem 
            itemKey='content' 
            width={200}
            //height={100}
            filter={v => striptags(v.raw || v.rendered)} 
          />

          <TableListReferenceItem
            itemKey='post'
            references={references.posts}
            refKey='id'
            filter={v => !v ? null : v.title.rendered}
          />

          <TableListItem 
            itemKey='date' 
            filter={v =>  moment(v).format('MMMM DD, YYYY')} 
          />

          <TableListItem 
            type="component" 
            component={this.comment.approveIcon} />

          <TableListItem itemKey='id' type='custom' >
            <IconActionButton 
              type='edit' 
              redirect={({itemValue}) => `comments/Edit/${itemValue}`} 
            />
          </TableListItem>
        </TableList>
        </div>);
    }
}

export default compose(
    withStyles,
    withTableList({namespace: 'list'}),
    withComment({namespace: 'comment'}),
    withHttp(),
)(List);

