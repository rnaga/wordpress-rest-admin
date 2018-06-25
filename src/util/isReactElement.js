
export default  elem => 
    (typeof elem === 'object' &&
        elem['$$typeof'].toString() === Symbol('react.element').toString() && typeof elem['type'] !== 'string' )
