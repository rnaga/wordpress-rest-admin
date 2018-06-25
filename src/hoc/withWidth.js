import React from 'react';
import {compose} from 'recompose';
import withSharedState, {ssNamespaces} from '../hoc/withSharedState';

const withWidth = options => WrappedComponent => {
    
    class Hoc extends React.Component{

        render(){

            const {innerWidth = 1000} = this.props.getSharedState();

            var width = 'xl'

            if(innerWidth < 1920)
                width = 'lg';
            
            if(innerWidth < 1280)
                width = 'md';

            if(innerWidth < 960)
                width = 'sm';

            if(innerWidth < 600)
                width = 'xs';

            return (
                <WrappedComponent 
                    {...this.props}  
                    width={width}
                />
            )
        }
    }

    return compose(
        withSharedState({namespace: ssNamespaces.width})
    )(Hoc);
}

export default withWidth;
