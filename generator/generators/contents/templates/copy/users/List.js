import React from 'react';
import {compose} from 'recompose';
import TableList, {TableListItem, TableListHead, TableListHeadItem} from 'wordpress-rest-admin/components/TableList';
import withTableList from 'wordpress-rest-admin/hoc/contents/withTableList';
import withHttp from 'wordpress-rest-admin/hoc/withHttp';
import withStyles from 'wordpress-rest-admin/hoc/withStyles';
import wpUrl from 'wordpress-rest-admin/util/wpUrl';
import adminUrl from 'wordpress-rest-admin/util/adminUrl';

class List extends React.Component{

    constructor(props){
        super(props);
        this.httpItems = this.httpItems.bind(this);
    }

    componentWillMount(){

        const {list} = this.props;

        list.bind(this, {
            httpList: this.httpItems,
            pageArgs: {
                per_page: 5,
                page: 1,
                orderby: 'id',
                order: 'desc',
                context: 'edit',
            },
            addNewButton: {
                redirect: () => adminUrl('users', 'Create').url
            }
        });

    }

    httpItems(){

        const {http} = this.props;

        const {parseHttpResponse, resetItems, updateItems, pageArgs} = this.list;

        resetItems();

        http('_items', {
            url: wpUrl().path('users').query(pageArgs).url, 
            method: 'GET',
            isProtected: true,
            onSuccess: (response) => {
                updateItems(parseHttpResponse(response));
            }
        });
    }

    render(){

        const {sort, searchbox, actionButtons, tablelistProps,} = this.list;

        return (
        <div>
        {searchbox()}
        <TableList {...(tablelistProps())} >
          <TableListHead>
            <TableListHeadItem sort={sort('id')}>Username</TableListHeadItem>
            <TableListHeadItem sort={sort('name')}>Name</TableListHeadItem>
            <TableListHeadItem sort={sort('email')}>Email</TableListHeadItem>
            <TableListHeadItem >Role</TableListHeadItem>
            <TableListHeadItem></TableListHeadItem>
          </TableListHead>

          <TableListItem itemKey='username' />
          <TableListItem itemKey='name'  />
          <TableListItem itemKey='email'  />
          <TableListItem itemKey='roles' type='array' />
          <TableListItem itemKey='id' type='custom' >
            {actionButtons({editLink: v => `users/Edit/${v}`})} 
          </TableListItem>
        </TableList>
        </div>);

    }
}

export default compose(
    withStyles,
    withTableList({namespace: 'list'}),
    withHttp(),
)(List);

