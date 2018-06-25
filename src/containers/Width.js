import React from 'react';
import {compose} from 'recompose';
import withSharedState, {ssNamespaces} from '../hoc/withSharedState';

class Width extends React.Component{

   componentWillMount() {
       this.handleWidth();
       window.addEventListener("resize", this.handleWidth.bind(this));
   }

   handleWidth(){
       const {setSharedState} = this.props;
       setSharedState({innerWidth: window.innerWidth});
   }

   render = () => null;
}

export default compose(
    withSharedState({namespace: ssNamespaces.width})
)(Width);

