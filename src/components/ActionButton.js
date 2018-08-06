import React from 'react';
import ReactDOM from 'react-dom';
import MuiButton from '@material-ui/core/Button';
import getIcon from '../util/getIcon';
import {withStyles} from '@material-ui/core/styles';

const ActionButton = props => {

    const {
           style: _style = {},
           styleIcon: _styleIcon = {},
           type = 'submit',
           onClick = () => {},
           label,
           icon,
           color = 'primary',
           variant = 'raised'
          } = props;

    const Icon = !icon ? null : getIcon({iconName: icon});
   
    const styles = theme => ({
        button: Object.assign({
            backgroundColor: '#2196f3',
            zIndex: 1101,
            '&:hover': {
                backgroundColor: '#0069d9',
            }
       }, _style),

       buttonIcon: Object.assign({
           width: 20, 
           height: 20, 
           marginLeft: theme.spacing.unit,
       }, _styleIcon),

    });

    const Button = withStyles(styles)(props => {

        const {classes} = props;
       
        return (<MuiButton
             type={type}
             className={classes.button}
             aria-label={label}
             variant={variant}
             color={color}
             onClick={onClick}
           >
            {label}
            {Icon && 
            <Icon className={classes.buttonIcon}/>}
            </MuiButton>);
    });

    return <Button />;
}

const FileButton = props => {

    const {onChange, ...rest} = props;

    const openFileDialog = () => {
        var fileUploadDom = ReactDOM.findDOMNode(this.fileUpload);
        fileUploadDom.click();
    }

    return (<div>
      <ActionButton {...rest} onClick={openFileDialog} />
      <input 
        ref={ref => this.fileUpload = ref} 
        type="file" 
        style={{"display" : "none"}}
        onChange={onChange} />
    </div>);
}

const SaveButton = props => {
    return <ActionButton {...props} label="Save" />
}

const DeleteButton = props => {

    const style = Object.assign({
        backgroundColor: '#f50057',
        '&:hover': {
            backgroundColor: '#db1c1c',
        }}, props.style || {}
    );

    return (<ActionButton label="Delete" {...props} style={style} type="button" />);
}

const CancelButton = props => <DeleteButton label="Cancel" {...props} />;

export default ActionButton;

export {SaveButton, DeleteButton, CancelButton, FileButton}

