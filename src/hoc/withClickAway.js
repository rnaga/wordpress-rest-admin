import React from 'react';
import {compose} from 'recompose';
import {connect} from 'react-redux';
import {actions} from '../actions';

const withClickAway = ({key}) => (WrappedComponent) => {
    
    class Hoc extends React.Component{

        componentWillUnmount(){
            const {dispatch} = this.props;
            dispatch(actions.clickAwayClear(key));
        }

        setClickAway({ref, i: index = 0, onClickAway}){
            const {dispatch} = this.props;

            if(ref)
                dispatch(actions.clickAwayRef({key, ref, index})); 
            
            if(onClickAway)
                dispatch(actions.clickAwayOnClickAway({key, onClickAway})); 
        }

        render(){
            return (
                <WrappedComponent 
                  {...this.props} 
                  setClickAway={this.setClickAway.bind(this)}
                />
            )
        }
    }

    return compose(connect(),)(Hoc);
}

export default withClickAway;
