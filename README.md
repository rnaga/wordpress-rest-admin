## WordPress REST Admin

A frontend for admin area of WordPress, using [WP REST API](https://v2.wp-api.org/) and [React](https://reactjs.org/).
It works with Self-Hosted WordPress.

[![Alt Screenshot](https://user-images.githubusercontent.com/20383976/41827852-a5e8504c-77e6-11e8-8667-3eb80f910fa2.png)](https://vimeo.com/276794147)

This project was bootstrapped with [Create React App](https://github.com/facebookincubator/create-react-app).

## Features

- Login (using JWT WP REST Plugin)
- Dashboard
- Posts(List, Edit, Add New, Trash)
- Pages(List, Edit, Add New, Trash)
- Categories and Tags
- Comments
- Users
- Profile
- Settings

## Installation
### Backend
First make sure that the followings are installed on your WordPress
#### WP REST API
- https://v2.wp-api.org/
- Note that WordPress (4.7 or later) has this installed by default

#### JWP Authentication for WP REST API 
- [Installation instructions](https://wordpress.org/plugins/jwt-authentication-for-wp-rest-api/)
- [Tutorial](https://www.youtube.com/watch?v=Mp7T7x1oxDk)

### git and npm

```
git clone https://github.com/rnaga/wordpress-rest-admin.git .
npm install
npm start
```
- Open http://localhost:3000 with your browser

## Supported Browsers

By default, the generated project uses the latest version of React.

You can refer [to the React documentation](https://reactjs.org/docs/react-dom.html#browser-support) for more information about supported browsers.

