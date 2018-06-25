import React from 'react';
import PropTypes from 'prop-types';
import {compose} from 'recompose';

import withPropsFilter from '../hoc/withPropsFilter';
import Item from './Item';

class Items extends React.Component {

    render(){

        const {items, children, renderCell, renderRow} = this.props;

        if(!Array.isArray(items))
            return null;

        return items.map( (item,i) => {

            const RenderRow = renderRow || null;
            const newItem = (<Item key={i} item={item} renderItem={renderCell}>{children}</Item>);

            return RenderRow ? (<RenderRow key={i}>{newItem}</RenderRow>) : newItem;
        });
    }
}

Items.propTypes = {
    items: PropTypes.array.isRequired
}

export default compose(
    withPropsFilter(),
)(Items);
