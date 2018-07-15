import React from 'react';
import {compose} from 'recompose';
import moment from 'moment';
import TableList, {
    TableListItem, 
    TableListReferenceItem, 
    TableListHead, 
    TableListHeadItem} from 'wordpress-rest-admin/components/TableList';
import withStyles from 'wordpress-rest-admin/hoc/withStyles';
import withHttp from 'wordpress-rest-admin/hoc/withHttp';
import withPage from 'wordpress-rest-admin/hoc/contents/withPage';
import withTableList from 'wordpress-rest-admin/hoc/contents/withTableList';
import wpUrl from 'wordpress-rest-admin/util/wpUrl';
import adminUrl from 'wordpress-rest-admin/util/adminUrl';
import IconActionButton from 'wordpress-rest-admin/components/IconActionButton';

class List extends React.Component{

    constructor(props){
        super(props);
        this.httpItems = this.httpItems.bind(this);
        this.httpReferences = this.httpReferences.bind(this);
    }

    componentWillMount(){

        const {page, list} = this.props;

        page.bind(this);
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
                redirect: () => adminUrl('pages', 'Create').url
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
        const {parseHttpResponse, resetItems, updateItems, pageArgs} = this.list;

        resetItems();

        http('_items', {
            url: wpUrl().path('pages').query(pageArgs).url, 
            method: 'GET',
            isProtected: true,
            onSuccess: (response) => {

                const {items, itemsCount} = parseHttpResponse(response);

                updateItems({items, itemsCount});

                var authorIds = [];

                items.forEach( item => {
                    authorIds.push(item.author);
                });

                this.httpReferences({
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

        const page = this.page;
        const {_location: location, 
               reload, 
               sort, 
               searchbox, 
               tablelistProps,
               _items: {references}} = this.list;

        return (
        <div>
        {searchbox()}
        <TableList {...(tablelistProps())} >
          <TableListHead>
            <TableListHeadItem sort={sort('title')}>Title</TableListHeadItem>
            <TableListHeadItem hidden={['xs']} adminOnly sort={sort('author')}>Author</TableListHeadItem>
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
              hidden={['xs']}
              filter={v => v.name}
            />

            <TableListItem 
              itemKey='date'
              filter={v =>  moment(v).format('MMMM DD, YYYY')}
            />

          <TableListItem 
            type='component'
            component={ itemValue => {
                return (<div>
                  {page.canEdit(itemValue) && (
                    <IconActionButton
                      type='edit'
                      redirect={() => `pages/Edit/${itemValue.id}`} />
                  )}
                  {page.canDelete(itemValue) && (
                    <IconActionButton
                      type='delete'
                      onClick={() => 
                          page.handleDelete({
                              pageId: itemValue.id, 
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
  withPage({namespace: 'page'}),
  withTableList({namespace: 'list'}),
  withStyles,
  withHttp(),
)(List);

