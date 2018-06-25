import React from 'react';
import {compose} from 'recompose';
import {connect} from 'react-redux';
import IconButton from '@material-ui/core/IconButton';
import Snackbar from '@material-ui/core/Snackbar';
import withWidth from '../hoc/withWidth';
import withStyles from '../hoc/withStyles';
import getIcon from '../util/getIcon';
import {actions} from '../actions';

const mapStateToProps = (state, ownProps) => ({
    errors: state.errors,
})

const messageHideLength = 256;

const Errorbar = compose(connect(mapStateToProps),withWidth())(

    class extends React.Component {
   
      constructor(props){
          super(props);
          this.state = {
              canToggle: false,
              hide: true,
          };
      }

      componentDidMount(){
          const {message} = this.props;

          if(message.length > messageHideLength)
              this.setState({canToggle: true});
          else
              this.setState({hide: false});
      }

      toggle(){
          this.setState({hide: !this.state.hide});
      }      

      handleClose(){
          let {errors, dispatch, id} = this.props;
          errors = errors.filter( (_,i) => i !== id );
          dispatch(actions.updateErrors({errors}));
      }
   
      render() {
    
        const {hide, canToggle} = this.state;

        let {
               width,
               message = 'Unknown Error'
        } = this.props;
    
        const Close = getIcon({iconName: 'Close'});
        const Error = getIcon({iconName: 'Error'});

        let actionButtons = [
          <IconButton 
            key="close" 
            aria-label="Close"
            color="inherit"
            onClick={this.handleClose.bind(this)}
          >
            <Close />
          </IconButton>
        ];

        let spanStyle = {
            display: 'block',
            whiteSpace: 'wrap',
            paddingTop: 1,
            width: width === 'xs' ? '100%' : 350,
            transition: 'width 0.1s',
        };

        if(canToggle){

            const HideShow = (hide)
                           ? getIcon({iconName: 'SwapHoriz'})
                           : getIcon({iconName: 'CompareArrows'})

            actionButtons = [
              <IconButton
                key="expand"
                color="inherit"
                onClick={this.toggle.bind(this)}
              >
                <HideShow />
              </IconButton>,
              ...actionButtons,
            ];

            if(hide)
                message = message.slice(0, messageHideLength) + '...';
        }

        const contentStyle = Object.assign({backgroundColor: '#d32f2f'}, (width === 'xs' || width === 'sm') ? 
                              null : {marginRight: 24, marginTop: 15});

        return (
            <Snackbar
              key={hide}
              style={{position: 'static', width: '100%'}}
              anchorOrigin={{
                vertical: 'top',
                horizontal: 'right',
              }}
              open={true}
              ContentProps={{
                'aria-describedby': 'message-id',
                style: contentStyle,
              }}
              message={(
                <div style={{display: 'flex'}}>
                  <Error style={{marginRight: 10}}/>
                  <span style={spanStyle} ref={ref => this.spanRef = ref}>{message}</span>
                </div>
              )}
              action={actionButtons}
            />);
      }
});

class Errorbars extends React.Component{

    render(){

        const {errors = [], width} = this.props;

        if(0 >= errors.length)
            return null;

        return (<div style={{
            zIndex: 1400, 
            width: '100%', 
            position: 'fixed', 
            display: 'flex', 
            justifyContent: 'right', 
            flexWrap: 'wrap',
            paddingTop: (width === 'sm' || width === 'xs') ? 0 : 55
         }}> 
            {errors.map( (error, i) => {
                return  (<Errorbar key={i} id={i} paddingTop={i*80} message={error.message+''} />);
            })}
        </div>);
    }
}

export default compose(
  withStyles,
  withWidth(),
  connect(mapStateToProps),
)(Errorbars);




