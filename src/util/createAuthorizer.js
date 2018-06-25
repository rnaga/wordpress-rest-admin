
const createAuthorizer = options => {

    class Authorizer {

        constructor(){
            this.options = options;
        }

        async authorize(...args){
            const {authorize: _authorize} = this.options;
            return await _authorize(this.options, ...args);
        }
    }

    return new Authorizer();
}

export default createAuthorizer;
