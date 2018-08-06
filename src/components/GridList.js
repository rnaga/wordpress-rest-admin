import React from 'react';
import {compose} from 'recompose';
import MuiGridList from '@material-ui/core/GridList';
import GridListTile from '@material-ui/core/GridListTile';
import GridListTileBar from '@material-ui/core/GridListTileBar';
import withStyles from '../hoc/withStyles';
import withWidth from '../hoc/withWidth';
import Image from './Image';
import IconActionButton from './IconActionButton';
import Paper from '@material-ui/core/Paper';

const Pagenation = props => {

    const {count, page, itemsPerPage, onChangePage} = props;

    const pageStart = 1 >= page ? 1 : (page - 1) * itemsPerPage + 1;
    const pageEnd   = pageStart + itemsPerPage - 1; 

    const isHead = page === 1;
    const isTail = page+1 > Math.ceil(count/itemsPerPage);

    const handleChangePage = (e, page) => {
        if(typeof onChangePage === 'function')
            onChangePage(e, page);
    };

    return (
      <div style={{height: 50, width: '100%', borderTop: '1px solid rgba(224, 224, 224, 1)', margin: '10px 0'}} >
        <div style={{float: 'right'}} >
          <span style={{color: 'rgba(0, 0, 0, 0.54)', fontSize: '0.75rem'}} >{pageStart} - {pageEnd > count ? count : pageEnd} of {count}</span>
          <IconActionButton type='chevronLeft' disabled={isHead} onClick={e => handleChangePage(e, page-1)} />
          <IconActionButton type='chevronRight' disabled={isTail} onClick={e => handleChangePage(e, page+1)} />
        </div>
      </div>);
}

class GridList extends React.Component{

    render(){

        const {items, count, pagenationProps, cssStyles, actionIcon, width} = this.props;
        const {
            page = 1,
            itemsPerPage,
            onChangePage,
        } = pagenationProps;

        if(!items) 
            return null;

        const cols = (width === 'xs') ? 1 
                   : (width === 'sm') ? 3 : 4;

        return(<div><Paper>
          <div style={{padding: 10}} >
            <MuiGridList cellHeight={160} cols={cols}>
            {items.map( item => (
              <GridListTile 
                 key={item.id} 
                 cols={1} 
                 classes={{root: cssStyles.mediaGridListTileImgFullWidth}} 
                 style={{padding: '10px 5px'}}>
      
                <Image 
                  src={item.source_url} 
                  alt={item.title.rendered} 
                  style={{display: 'block', marginLeft: 'auto', marginRight: 'auto', height: '100%'}} 
                />

                <GridListTileBar
                  style={{height: 42}}
                  title={<span style={{fontSize: '0.7rem'}}>{item.title.rendered}</span>}
                  actionIcon={
                      actionIcon(item)
                  }
                />

             </GridListTile>
           ))}
           </MuiGridList>
          </div>

          <Pagenation 
            page={page} 
            count={count} 
            itemsPerPage={itemsPerPage} 
            onChangePage={onChangePage}
          />

        </Paper></div>);
    }
}

export default compose(
    withStyles,
    withWidth(),
)(GridList);


