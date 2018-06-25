import React from 'react';
import {compose} from 'recompose';
import {connect} from 'react-redux';

const withCurrentContent = WrappedComponent => {

    class Hoc extends React.Component{

        render(){
            return <WrappedComponent {...this.props} />;
        }
    }

    const mapStateToProps = (state) => {
        return {
            currentContent: state.currentContent,
        }
    };

    return compose(
        connect(mapStateToProps, null),
    )(Hoc);
}

export default withCurrentContent;
