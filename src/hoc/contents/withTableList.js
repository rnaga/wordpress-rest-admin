import React from 'react';
import {compose} from 'recompose';
import queryString from 'querystring';
import {Link} from 'react-router-dom';
import IconButton from '@material-ui/core/IconButton';
import IconActionButton from '../../components/IconActionButton';
import getIcon from '../../util/getIcon';
import Contents from './contents';
import SearchBox from '../../components/SearchBox';
import withStyles from '../../hoc/withStyles';
import withContentToolbar from '../../hoc/withContentToolbar';
import httpNormalizeResponseBody from '../../util/httpNormalizeResponseBody';
import httpGetHeaders from '../../util/httpGetHeaders';

const withTableList = ({namespace}) => WrappedComponent => {

    class Hoc extends Contents{

        render(){
            return this._render({namespace, WrappedComponent});
        }

        bindComponent(component, _options){

            super.bindComponent(namespace, component, _options);

            component[namespace] = Object.assign(component[namespace], {
                _items: {},
                pageArgs: _options.pageArgs,
                initPageArgs: Object.assign({}, _options.pageArgs),
                httpList: _options.httpList,
                reload: this.reload.bind(component),
                updatePageArgs: this.updatePageArgs.bind(component),
                sort: this.sort.bind(component),
                searchbox: this.searchbox.bind(component),
                addNewButton: this.addNewButton.bind(component),
                actionButtons: this.actionButtons.bind(component),
                resetItems: this.resetItems.bind(component),
                parseHttpResponse: this.parseHttpResponse.bind(component),
                updateItems: this.updateItems.bind(component),
                tablelistProps: this.tablelistProps.bind(component),
                updateReferenceItems: this.updateReferenceItems.bind(component),
            });

            const _component = component[namespace];

            const {
                _location: location, 
                reload,
                addNewButton,
                resetItems} = _component; 

            resetItems();

            reload(location);
         
            const {addNewButton: addNewButtonOptions} = _options;

            if(addNewButtonOptions)
                addNewButton(addNewButtonOptions);
        }

        reload(location){

            const pageArgs = Object.assign({},
                this[namespace].initPageArgs,
                queryString.parse(location.search.substring(1)), 
            );

            pageArgs.page = parseInt(pageArgs.page, 10);
            pageArgs.per_page = parseInt(pageArgs.per_page, 10);

            this[namespace].pageArgs = pageArgs;
            this[namespace].httpList();
        }

        updatePageArgs(args){

            const {_location: location, _history: history} = this[namespace];
            var {pageArgs} = this[namespace];

            pageArgs = Object.assign(pageArgs, args);
            this[namespace].pageArgs = pageArgs;

            // This triggers history.listen, then execute reload
            history.push(`${location.pathname}?${queryString.stringify(pageArgs)}`);
//            this[namespace].httpList();
        }

        sort(name){
            const {updatePageArgs, pageArgs} = this[namespace];

            const active = name === pageArgs.orderby;
            const direction = pageArgs.order;

            return {
                active,
                direction,
                handleOnClick: e => {
                    updatePageArgs({
                        orderby: name, 
                        order: (!active||direction === 'asc') ? 'desc' : 'asc',
                    });
                }
            }
        }

        searchbox(options = {}){

            const {cssStyles} = this.props;
            const {updatePageArgs, pageArgs} = this[namespace];
            const {searchKey = 'search'} = options;

            return (<div style={{flex: 1, paddingBottom: 40}}>
              <SearchBox
                defaultValue={pageArgs.search || ''}
                onKeyDown={ e => {
                    (e.keyCode === 13) && updatePageArgs({[searchKey]: e.target.value, page: 1})
                }}
                className={cssStyles.postsSearchForm}
             />
            </div>);
        }

        addNewButton(options = {}){

            const {setContentToolbar} = this.props;

            const {onClick, 
                   redirect, 
                   style = {fontSize: 32}} = options;

            const element = (<IconActionButton
              iconStyle={style}
              type={'addCircleOutline'}
              label="Add New"
              labelPlacement="right"
              onClick={onClick}
              redirect={redirect}
            />);

            setContentToolbar({element});          
        }

        actionButtons(options = {}){

            const {cssStyles} = this.props;

            const ActionButtons = ({itemValue}) => {

                const Edit = getIcon({iconName: 'Edit'});
                const Delete = getIcon({iconName: 'Delete'});

                const {handleDelete, editLink, editCustom} = options;

                return (<div>
                  {editCustom && editCustom({
                      Icon: Edit, 
                      Button: IconButton, 
                      iconButtonProps: {
                          className: cssStyles.button,
                          'aria-label': "Edit", 
                      }
                  })}
                  {editLink &&
                  <Link to={editLink(itemValue)}>
                    <IconButton className={cssStyles.button} aria-label="Edit" >
                      <Edit />
                    </IconButton>
                  </Link>}
                  {handleDelete &&
                  <IconButton
                    className={cssStyles.button}
                    aria-label="Delete"
                    style={{color: 'rgb(225, 0, 80)'}}
                    onClick={e => handleDelete(itemValue)}
                 >
                   <Delete />
                 </IconButton>}
               </div>);
           }

           return <ActionButtons />;
       }

       resetItems(){
           const {updateItems} = this[namespace];
           updateItems({references: {}, items: null, itemsCount: 0});
       }

       parseHttpResponse(response){

           const headers = httpGetHeaders({response});

           const items = httpNormalizeResponseBody({response});
           const itemsCount = parseInt(headers['x-wp-total'], 10);

           return {items, itemsCount};
       }

       updateItems(args){
           this[namespace]._items = 
               Object.assign(this[namespace]._items, args);
       }

       updateReferenceItems(args){
           this[namespace]._items.references =
               Object.assign(this[namespace]._items.references, args);
       }

       tablelistProps(){

          const {_items: {items, itemsCount}, pageArgs, updatePageArgs} = this[namespace];

          return{ 
              items,
              count: itemsCount,
              page: (pageArgs.page-1),
              rowsPerPage: pageArgs.per_page,
              rowsPerPageOptions: [5,10,25,50],
              handleChangePage: (e,page) => updatePageArgs({page: (page+1)}),
              handleChangeRowsPerPage: value => updatePageArgs({per_page: value, page: 1}),
          }
       }

    }

    return compose(withStyles, withContentToolbar)(Hoc);
}

export default withTableList;


