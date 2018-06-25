import createLink from './createLink';

const createContent = (name, func) => {
    
    const {basePath, linkTo: contentBasePath, pagePath, rePath} = createLink(name);

    var config = func({basePath, contentBasePath, pagePath});

    const content = Object.assign({}, config, {
        name,
        basePath,
        contentBasePath,
        pagePath,
        rePath,
    });

    return content;
}

export default createContent;

