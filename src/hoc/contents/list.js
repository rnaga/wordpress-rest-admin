import React from 'react';
import queryString from 'querystring';
import {Link} from 'react-router-dom';
import IconButton from '@material-ui/core/IconButton';
import IconActionButton from '../../components/IconActionButton';
import getIcon from '../../util/getIcon';
import Contents from './contents';
import SearchBox from '../../components/SearchBox';
import httpNormalizeResponseBody from '../../util/httpNormalizeResponseBody';
import httpGetHeaders from '../../util/httpGetHeaders';

const List = ({namespace}) => {

//    return compose(withStyles, withContentToolbar)( 
    
    return class extends Contents{

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
    
    }
}

export default List;



