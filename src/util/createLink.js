
export default (contentName) => ({
    basePath: `/_content`,
    linkTo: `/_content/${contentName}`,
    pagePath: `/_content/${contentName}/:pageName?/:query?`,
    rePath: (path) => { 

        const match = path.match(new RegExp(`^/_content/${contentName}(?:$|/$|/([a-zA-Z0-9]+))(?:$|/$|/(.+))`));

        if(!Array.isArray(match))
            return {
                contentName: undefined, 
                pageName: undefined, 
                query: undefined, 
                rest: undefined
            };

        const [, pageName, query, ...rest] = match;

        return {contentName, pageName, query, rest};
    },
});

