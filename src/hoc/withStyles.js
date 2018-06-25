import React from 'react';
import PropTypes from 'prop-types';

const withStyles = (WrappedComponent) => {
    
    class Hoc extends React.Component{
        render(){
            return (
                <WrappedComponent cssStyles={this.context.classes} {...this.props}  />
            )
        }
    }

    Hoc.contextTypes = {
        classes: PropTypes.object
    };

    return Hoc;
}

export default withStyles;
