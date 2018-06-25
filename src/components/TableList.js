import React from 'react';
import {compose} from 'recompose';
import Hidden from '@material-ui/core/Hidden';
import Paper from '@material-ui/core/Paper';
import CircularProgress from '@material-ui/core/CircularProgress';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import TablePagination from '@material-ui/core/TablePagination';
import TableSortLabel from '@material-ui/core/TableSortLabel';
import withPropsFilter from '../hoc/withPropsFilter';
import withStyles from '../hoc/withStyles';
import Items from '../containers/Items';
import isReactElement from '../util/isReactElement';
import cloneReactElement from '../util/cloneReactElement';
import toReferences from '../util/toReferences';
import withAuth from '../hoc/withAuth';

const TableListHead = ({children}) => children;

const TableListHeadItem = withAuth()(props => {

    const {children, hidden, sort} = props;
   
    var cell = (!sort) 
             ? <TableCell>{children}</TableCell>
             : <TableCell>
                  <TableSortLabel 
                    active={sort.active}
                    direction={sort.direction}
                    onClick={sort.handleOnClick}
                  >{children}</TableSortLabel>
                </TableCell>;
              
    if(hidden) 
        return <Hidden key={Math.random()} only={hidden}>{cell}</Hidden>
    
     return cell;
})

const TableListItem = withAuth()(props => {

    const {children, 
           hidden, 
           style,
           type,
           filter: _filter,
           width,
           height,
          } = props;

    var {itemValue} = props;
    var output = null;

    const filter = (itemValue) => {
        if(typeof _filter !== 'function')
            return itemValue;

        try{
            return _filter(itemValue);
        }catch(err){
            console.warn(err);
            return null;
        }    
    }

    switch(type){

        case 'array':
            output = itemValue.map( (v,k) => {
                return (!v ? null : <div key={k}>{filter(v)}</div>);
            });

            break;

        case 'custom':
            output = React.Children.map(children, (child, i) => {
                return cloneReactElement(
                    child,
                    {...child.props, itemValue, key: i},
                    child.props.children
                );
            });

            break;

        case 'component':

            const elem = typeof props.component === 'function' 
                       ? props.component(itemValue) : props.component;

            output = cloneReactElement(
                    elem,
                    {...elem.props, itemValue},
                    elem.props.children
                );

            break;

        case 'text': 
        default:
            output = filter(itemValue);
            break;
         
    }

    if(width || height){

        var styleCell = {
            display: 'inline-block',
            overflowWrap: 'break-word',
            wordWrap: 'break-word',
            hyphens: 'auto',
            overflowY: 'auto',
        };

        if(width)
            styleCell = Object.assign(styleCell, {width});

        if(height)
            styleCell = Object.assign(styleCell, {height});

        output = <div style={styleCell}>{output}</div>;
    }


    if(hidden){
        return (<Hidden only={hidden}>
        <TableCell style={style}>
          {output}
        </TableCell>
        </Hidden>);
    }

    return (<TableCell>{output}</TableCell>);
})

const TableListReferenceItem = withAuth()(props => {

    const {references,
           refKey} = props;

    var {itemValue} = props;
    var options;

    if(!references)
         options = {
             filter: null,
             type: null,
             itemValue: (<CircularProgress />)
         };
    else
        options = {itemValue: toReferences(itemValue, refKey, references)}

    const output = <TableListItem {...props} {...options} />

    return output;
})

const TableListPagenation = props => {
    const {
        count,
        rowsPerPage,
        page,
        handleChangePage, 
        handleChangeRowsPerPage,
        cssStyles,
        } = props;

    return (
      <TablePagination
        classes={{
            input: cssStyles.tableListPagenationInput
        }}
        component={props => {

            var _children = [...props.children.props.children];

            const label = (<span key={10} style={{
                fontSize: '0.7rem', 
                marginRight: 10, 
                width: 120, 
                display: 'inline-block'}}
            >Rows per page:
            </span>);

            const select = (<select 
                key={11}
                style={{marginRight: 10}}
                value={rowsPerPage}
                onChange={e => handleChangeRowsPerPage(e.target.value)}
            >
            {([5,10,25,50]).map( (v,i) => {
                return <option key={i} value={parseInt(v, 10)}>{v}</option>
            })}
            </select>);

            _children[1] = label;
            _children[2] = select;

            const children = cloneReactElement(
                props.children,
                {children: _children});

            return children;

        }}
        count={count}
        rowsPerPage={rowsPerPage}
        page={page}
        backIconButtonProps={{
          'aria-label': 'Previous Page',
        }}
        nextIconButtonProps={{
          'aria-label': 'Next Page',
        }}
        onChangePage={handleChangePage}
        onChangeRowsPerPage={handleChangeRowsPerPage}
        rowsPerPageOptions={[]}
      />
    );
}


class TableList extends React.Component{

    constructor(props){
        super(props);
        this.keyIndex = 0;
        this.renderCell = this.renderCell.bind(this);
        this.renderRow = this.renderRow.bind(this);
    }

    renderCell(props){ 
        return props.children;
    }

    renderRow(props){
        return (<TableRow key={this.keyIndex++}>{props.children}</TableRow>);
    }

    render(){

        const {
            handleChangePage, 
            handleChangeRowsPerPage,
            rowsPerPage = 5,
            page = 0,
            cssStyles, 
            children, 
        } = this.props; 

        var body = [], items, head, noResults, count = 0;

        try{
            noResults = Array.isArray(this.props.items);
            items = this.props.items || [];
            count = this.props.count || 0;
        }catch(err){
            items = [];
        }

        const hasItems = items.length > 0;

        React.Children.forEach(children, (child, i) => {

            if(!isReactElement(child))
                return;

            if(child.type === TableListHead)
                head = child;
            else //if(child.type === TableListItem || child.type === TableListReferenceItem)
                body.push(child);
        }); 


        return (
          <Paper className={cssStyles.tableList}>
          <div style={{overflowX: 'auto'}}>
          <Table style={{ tableLayout: "auto" }}>
           <TableHead>
             <TableRow>
             {head}
             </TableRow>
           </TableHead>
           <TableBody>
           {(() => {
             if(!hasItems){
                 return (
                 <TableRow>
                   <TableCell 
                     colSpan={head.props.children.length} 
                     style={{textAlign: 'center', height: 100}}>
                     {noResults ? 'No Results Found' : 'Loading...'}
                   </TableCell>
                 </TableRow>);
             }else{
                 return (             
                  <Items items={items} renderRow={this.renderRow} renderCell={this.renderCell}>
                     {body}
                  </Items>);
             }
           })()}
           </TableBody>
          </Table>
          </div>
          {hasItems &&
          <TableListPagenation
            cssStyles={cssStyles}
            count={count}
            rowsPerPage={rowsPerPage}
            page={page}
            handleChangePage={handleChangePage}
            handleChangeRowsPerPage={handleChangeRowsPerPage}
          />}
          </Paper>);
    }
}

export default compose(
    withPropsFilter(),
    withStyles,
)(TableList);

export {
    TableListHead, 
    TableListHeadItem, 
    TableListItem, 
    TableListReferenceItem,
    TableListPagenation
};



