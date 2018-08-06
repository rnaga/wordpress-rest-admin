import React from 'react';
import {compose} from 'recompose';
import {withRouter} from 'react-router-dom'
import IconButton from '@material-ui/core/IconButton';
import Tooltip from '@material-ui/core/Tooltip';
import CircularProgress from '@material-ui/core/CircularProgress';
import getIcon from '../util/getIcon';
import withStyles from '../hoc/withStyles';
import withPropsFilter from '../hoc/withPropsFilter';

class IconActionButton extends React.Component{

    constructor(props){
        super(props);
        this.state = {loading: false};
    }

    handleClick(e){

        const {onClick, redirect, history, isAsync, ...rest} = this.props;

        if(redirect){
            history.push(redirect(rest));
            return;
        }

        if(typeof onClick !== 'function')
            return;

        if(isAsync)
            this.setState({loading: true});

        onClick(rest);
    }

    render(){

        const {type: iconType = 'save', 
               disabled = false,
               cssStyles, 
               isAsync, 
               iconStyle = {}, 
               label, 
               labelPlacement = 'bottom'} = this.props;

        const iconName = iconType.charAt(0).toUpperCase() + iconType.slice(1);
        const Icon = getIcon({iconName});

        if(isAsync && this.state.loading)
            return <CircularProgress />; 

        var {style = {}} = this.props;

        if(iconType === 'delete')
            style = Object.assign({}, style, {color: 'rgb(225, 0, 80)'});

        if(iconType === 'save')
            style = Object.assign({}, style, {color: '#2196f3'});

//        if(redirect){
//            onClick = rest => history.push(redirect(rest));
//        }

//        const type = (iconType === 'save') ? 'submit' : 'button';

        let element = ( 
          <IconButton 
            className={cssStyles.button}
//            type={type}
            disabled={disabled}
            style={style}
            aria-label={iconName}
            onClick={this.handleClick.bind(this)}>

            <Icon style={iconStyle} />
          </IconButton>
        );

        if(label){
            element = (
              <Tooltip
                id="tooltip-right"
                title={label}
                placement={labelPlacement}>

               {element}
             </Tooltip>);
        }

        return element;
    }
}


export default compose(
    withRouter,
    withStyles,
    withPropsFilter(),
)(IconActionButton);

