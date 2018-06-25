//import Inbox from "@material-ui/icons/Inbox";

import * as Icons from "@material-ui/icons"

// https://kamranicus.com/posts/2017-09-02-dynamic-import-material-icons-react
export default ({iconName}) => {

    if(!iconName) iconName = 'Inbox';

//    let Icon = require(`@material-ui/icons/${iconName}`).default

    let Icon = Icons[iconName]; //Inbox; //require(`@material-ui/icons/${iconName}`).default

    if (!Icon) {
        throw Error(`Could not find @material-ui/icons/${iconName}`)
    }

    return Icon;
}

