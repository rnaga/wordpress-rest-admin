import React, { Component } from 'react';
import WPAdmin from 'wordpress-rest-admin/WPAdmin'; 
import contents from 'wordpress-rest-admin/contents';
import loginLogo from './WordpressLogo.svg';
import headerLogo from './WordpressLogo.png';

// A new content created by generator
import mypage from './contents/mypage';

// A copied content created by 'yo wordpress-rest-admin:contents --copy-from=pages'
import pages from './contents/pages';

class App extends Component {

    render() {

        // Retrieve contents 
        const {dashboard, posts, categories, tags, comments, users, profile, settings} = contents;

        // Set default content
        const defaultContent = dashboard;


        return (<WPAdmin 
          loginLogo={loginLogo}
          headerLogo={headerLogo}
          defaultContent={defaultContent}
          contents={{dashboard, posts, pages, categories, tags, comments, users, profile, settings, mypage}} 
        />);
    }
}

export default App;
