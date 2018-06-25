import React from 'react';
import PropTypes from 'prop-types';
import {compose} from 'recompose';
import cloneReactElement from '../util/cloneReactElement';
import withPropsFilter from '../hoc/withPropsFilter';

class Item extends React.Component {

    render(){

        const {children, item, renderItem: RenderItem} = this.props;
        const itemKeys = Object.keys(item);

        const output = React.Children.map(children, (child, i) => {

            const {itemKey} = child.props;

            child = cloneReactElement(child, {
                ...child.props, 
                itemValue: (itemKeys.includes(itemKey)) ? item[itemKey] : item, 
                key: i
            }, child.props.children);
             
            if(RenderItem){
                return (<RenderItem key={i}>{child}</RenderItem>);
            }

            return child;
        });

        return output;
    }
}

Item.propTypes = {
    item: PropTypes.object.isRequired,
    itemRender: PropTypes.func
}

export default compose(
    withPropsFilter(),
)(Item);
