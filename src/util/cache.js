

var cache = {}

const create = (name, options) => {
    cache[name] = {
        data: {},
        options,
    }
}

const createIfNotExists = (name, options) => {
    if(typeof cache[name] === 'undefined')
        create(name, options);
}

const clear = (name) => {
    cache[name].data = {};
}

const check = (name, keys) => {

    var keysNotIncluded = [];

    if(typeof cache[name] === 'undefined')
        return keys;

    keys.forEach( (v,i) => {
        if(!cache[name].data[v])
            keysNotIncluded.push(v);
    });

    return keysNotIncluded;   
}

const get = (name, keys) => {

    var r = [];

    keys.forEach( (v,i) => {
        if(cache[name].data[v])
            r.push(cache[name].data[v]);
    });

    return r;
}

const getOne = (name, key) => {
    const values = get(name, [key]);
    return Array.isArray(values) ? values[0] : null;
}

const getAll = (name) => cache[name].data;

const getOptions = (name) => {
    return cache[name].options;
}

const updateOptions = (name, options) => {
    cache[name].options = options;
}

const update = (name, key, value) => {
    createIfNotExists(name);
    cache[name].data[key] = value;
}

class Cache {

    constructor(name, options){

        if(typeof name !== 'string')
            throw new Error('name not defined');

        this.name = name;
        createIfNotExists(name, options);        
    }

    clear  = ()   => clear(this.name)
    getAll = ()   => getAll(this.name)
    check  = keys => check(this.name, keys)
    get    = keys => get(this.name, keys)
    getOne = key  => getOne(this.name, key)
    getOptions = () => getOptions(this.name)
    update = (key, value) => update(this.name, key, value)
    updateOptions = options => updateOptions(this.name)

}

export default Cache;
export {
    create, 
    createIfNotExists, 
    clear, 
    check, 
    get, 
    getOne,
    getAll,
    getOptions, 
    updateOptions, 
    update
}


