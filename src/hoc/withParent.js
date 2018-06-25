import React from 'react';

const withParent = WrappedComponent => {

    class Hoc extends React.Component{

        render(){

            var _parent = (<WrappedComponent {...this.props} />);

            const newChildren = React.Children.map(_parent.props.children, (child, i) => {
                return React.cloneElement(
                    child,
                    {_parent});
            });

            // Bind newChildren with the parent instance set in props 
            _parent = React.cloneElement(_parent, {}, newChildren);

            return _parent;
        }
    }

    return Hoc; 
}

export default withParent;
