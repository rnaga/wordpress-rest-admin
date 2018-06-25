import React from 'react';
import withSharedState, {ssNamespaces} from './withSharedState';

const withSidebar = (WrappedComponent) => {

    class Hoc extends React.Component{

        setSidebarState({open, collapse}){
            this.props.setSharedState({open, collapse}); 
        }

        handleSidebarToggle(){

            const {getSharedState, setSharedState} = this.props;

            let {open = false, collapse = true} = getSharedState();

            setSharedState({open: !open, collapse});
        }

        handleSidebarCollapse(collapse){
            const {getSharedState, setSharedState} = this.props;
            let {open = false} = getSharedState();
            setSharedState({open, collapse});
        }

        isSidebarCollapse(){
            let {collapse = true} = this.props.getSharedState();
            return collapse;
        }

        render(){

            const {getSharedState} = this.props;

            let {open = false} = getSharedState();

            return (<WrappedComponent
                     {...this.props}
                     isSidebarOpen={open} 
                     isSidebarCollapse={this.isSidebarCollapse.bind(this)}
                     handleSidebarToggle={this.handleSidebarToggle.bind(this)}
                     handleSidebarCollapse={this.handleSidebarCollapse.bind(this)}
                    />);
        }
    }

    return withSharedState({namespace: ssNamespaces.sidebar})(Hoc);

}

export default withSidebar;
