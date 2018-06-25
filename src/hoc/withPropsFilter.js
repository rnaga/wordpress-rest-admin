import React from 'react';

const withPropsFilter = (options = {}) => WrappedComponent => {

    const getNewProps = ({filterOverride = false, filterBindProp = null}, props, filteredValues) => {

        let newProps;

        if(filterBindProp)
            // Pass filtered values to the specific prop
            newProps = Object.assign({}, props, {[filterBindProp]: {...filteredValues}});
        else
            // Merge filtered values into props or replace props with filtered values 
            newProps = !filterOverride 
                       ? Object.assign({}, props, filteredValues)
                       : filteredValues;

        return newProps;
    }

    class Hoc extends React.Component{

        constructor(props){
            super(props);
            this.state = {isAsyncUpdated: false}

            this.filter = this.props.filter;
        }

        componentWillMount() {

            const {isAsyncFilter} = this.props;

            if( false === isAsyncFilter || typeof this.filer !== 'function' )
                return;

            const _self = this;
 
            this.filter(this.props)
              .then( filteredValues => {
                  _self.newProps = getNewProps(options, this.props, filteredValues); 
                  _self.setState({isAsyncUpdated: true});
              })
        }

        render(){

            const {isAsyncUpdated} = this.state;
            const {isAsyncFilter} = this.props;

            // Async data filtering
            if( true === isAsyncFilter){
                return (false === isAsyncUpdated) ?
                    null : <WrappedComponent {...this.newProps} />
            }

            if( typeof this.filter === 'function' ){
                this.props = getNewProps(options, this.props, this.filter(this.props));
            }

            return (<WrappedComponent {...this.props} />);
        }
    }

    return Hoc; 
}

export default withPropsFilter;
