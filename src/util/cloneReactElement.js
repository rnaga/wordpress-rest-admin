import React from 'react';
import isReactElement from './isReactElement';

export default (elem, props = {}, children = null) => {

    if(!isReactElement(elem)){
        return elem;
    }

    const newElem = children 
                  ? React.cloneElement(elem, {...props}, children)
                  : React.cloneElement(elem, {...props})

    return newElem;
}
