import React from 'react';
import caches from '../util/caches';

const withAuth = (options = {}) => WrappedComponent => {

    const {passAuth = false} =  options;

    class Hoc extends React.Component{

        constructor(props){
            super(props);
            this.authedRoles = this.authedRoles.bind(this);
            this.isAdmin = this.isAdmin.bind(this);
        }

        logOut(){
            const defaultAuthorizer = caches('defaultAuthorizer'); 
            const authorizer = defaultAuthorizer.get();
            authorizer.options.logOut();
            window.location.reload();
        }

        async logIn({username, password, remember, }){
            const defaultAuthorizer = caches('defaultAuthorizer'); 
            const authorizer = defaultAuthorizer.get();

            try{
                return await authorizer.options.logIn({username, password, remember});
            }catch(err){
                throw err;
            }

        }

        isAuthed(){
            const defaultAuthorizer = caches('defaultAuthorizer'); 
            const authorizer = defaultAuthorizer.get();
            return authorizer.options.isAuthed();
        }

        authedRoles(roles){

            if(!Array.isArray(roles))
                return false;

            const account = caches('account'); 
            return 0 <= roles.indexOf(account.role);
        }

        isCapableOf(caps){

            if(!Array.isArray(caps))
                return false;

            const account = caches('account'); 

            for(let i = 0; i < caps.length; i++){
                let cap = account.cap[caps[i]];

                if(!cap) continue;

                return true;
            }

            return false;
        }

        isAdmin(){
            return this.authedRoles(['administrator']);
        }

        render(){

            if(!passAuth){

                const {authedRoles, adminOnly, isCapableOf} = this.props;

                if(authedRoles && !this.authedRoles(authedRoles))
                    return null;

                if(adminOnly && !this.isAdmin())
                    return null;

                if(isCapableOf && !this.isCapableOf(isCapableOf))
                    return null;
            }

            return (
              <WrappedComponent 
                {...this.props}
                logOut={this.logOut.bind(this)}
                logIn={this.logIn.bind(this)}
                isAuthed={this.isAuthed.bind(this)}
//                isCapableOf={this.isCapableOf.bind(this)}
              />);
        }
    }

    return Hoc;
}

export default withAuth;
