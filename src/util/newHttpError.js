

const newHttpError = (msg, returnValue) => {
    var err = new Error(msg);

    err.getReturnValue = () =>{
        return returnValue;
    }

    return err;
}


export default newHttpError;;
