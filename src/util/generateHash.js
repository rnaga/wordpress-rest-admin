import md5 from 'md5';

export default (...o) => md5(JSON.stringify(o));
