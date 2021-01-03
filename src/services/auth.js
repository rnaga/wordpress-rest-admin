import Cookies from 'universal-cookie';
import newHttpError from '../util/newHttpError';
import caches from '../util/caches';

// Use cookie to store JWT's login token
const cookies = new Cookies();

const auth = {

    authorize: async () => {

        const login_token = cookies.get('login_token');

        if(!login_token)
            throw new Error('Login_Token_Not_Defined');

        return {
            httpOptions: {
                headers: {Authorization: `Bearer ${login_token}`}
            }
        };
    },

    isAuthed: () => {
        return cookies.get('login_token') ? true : false;
    },

    logOut: () => {
        cookies.remove('login_token', { path: '/' }) 
    },

    logIn: async ({username, password, remember}) => {

        const wpBaseUrl = caches('wpBaseUrl'); 
        const url = `${wpBaseUrl.get()}/wp-json/jwt-auth/v1/token`;
  
        const results = await fetch(url, {
            body: JSON.stringify({username, password}),
            method: 'POST',
            headers: {
                'content-type': 'application/json'
            }, 
        });

        const body = await results.json();

        const {headers, ok, status: statusCode} = results;

        const returnValue = {headers, ok, statusCode, body};
 
        if(!ok || (statusCode < 200 && statusCode > 299 ) ){
            throw newHttpError('Login Failed', returnValue);
        }

        // 3600 => 1 hour, 604800 => 1 week
        const maxAge = (!remember) ? 3600 : 604800

        const token = body.token || body.data.token;

        cookies.set('login_token', token, {path: '/', maxAge});

        return returnValue;

    }

}

export default auth;
