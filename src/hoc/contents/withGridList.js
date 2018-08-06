import {compose} from 'recompose';
import withStyles from '../../hoc/withStyles';
import List from './list';
import withContentToolbar from '../withContentToolbar';

const withGridList = ({namespace}) => WrappedComponent => {

    class Hoc extends List({namespace}){ 

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
                gridlistProps: this.gridlistProps.bind(component),
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

       gridlistProps(){

           const {_items: {items, itemsCount}, pageArgs, updatePageArgs} = this[namespace];

           const pagenationProps = {
               page: pageArgs.page,
               itemsPerPage: 20,
               onChangePage: (e,page) => updatePageArgs({page})
           }

           return{
               items,
               pagenationProps,
               count: itemsCount,
               page: (pageArgs.page-1),
               rowsPerPage: pageArgs.per_page,
//               rowsPerPageOptions: [5,10,25,50],
               handleChangePage: (e,page) => updatePageArgs({page: (page+1)}),
           }
       }
    }

    return compose(withStyles, withContentToolbar)(Hoc);
}

export default withGridList;


