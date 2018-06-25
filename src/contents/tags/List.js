import React from 'react';
import {compose} from 'recompose';
import TableList, {TableListItem, TableListHead, TableListHeadItem} from '../../components/TableList';
import withTableList from '../../hoc/contents/withTableList';
import withTag from '../../hoc/contents/withTag';
import withHttp from '../../hoc/withHttp';
import withStyles from '../../hoc/withStyles';
import wpUrl from '../../util/wpUrl';

class List extends React.Component{

    constructor(props){
        super(props);
        this.httpItems = this.httpItems.bind(this);
    }

    componentWillMount(){

        const {list, tag, __reloadContent} = this.props;

        tag.bind(this, {submitAfter: __reloadContent});

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
                onClick: this.tag.renderForm
            }
        });
    }

    httpItems(){

        const {http} = this.props;

        const {parseHttpResponse, resetItems, updateItems, pageArgs} = this.list;

        resetItems();

        http('_items', {
            url: wpUrl().path('tags').query(pageArgs).url, 
            method: 'GET',
            isProtected: true,
            onSuccess: (response) => {
                updateItems(parseHttpResponse(response));
            }
        });
    }

    render(){

        const {
            sort, 
            searchbox, 
            tablelistProps,} = this.list;

        const {editButton} = this.tag;

        return (
          <div>
          {searchbox()}
          <TableList {...(tablelistProps())} >

            <TableListHead>
              <TableListHeadItem sort={sort('id')}>Name</TableListHeadItem>
              <TableListHeadItem sort={sort('slug')}>Slug</TableListHeadItem>
              <TableListHeadItem sort={sort('count')}>Count</TableListHeadItem>
              <TableListHeadItem></TableListHeadItem>
            </TableListHead>

            <TableListItem itemKey='name' />
            <TableListItem itemKey='slug' />
            <TableListItem itemKey='count' />
            <TableListItem 
              type='component'
              component={ itemValue => {
                  return editButton({edit: itemValue});
              }}
            />
          </TableList>
          </div>);
    }
}

export default compose(
    withStyles,
    withTableList({namespace: 'list'}),
    withTag({namespace: 'tag'}),
    withHttp(),
)(List);


