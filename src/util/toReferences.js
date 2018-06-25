

const getReference = (targetValue, refKey, references) => {
    if(!Array.isArray(references))
        throw new Error('In arrayToReferences: references is not an Array');
    

    for(let i = 0; i < references.length; i++){
        var reference = references[i];

        if(typeof reference !== 'object')
            throw new Error('In arrayToReferences: reference is not an object');

        if(targetValue === reference[refKey])
            return reference;
    }

    return null;
}

export default (resource, refKey, references) => {

    if(Array.isArray(resource)){

        var refs = [];
        resource.forEach( v => {
            var ref = getReference(v, refKey, references);
            if(ref) refs.push(ref);
        });

        return refs;
    }

    if(typeof resource === 'number'){
        return getReference(resource, refKey, references);
    }

    return resource;
}
