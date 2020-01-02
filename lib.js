/**
 * IMPORTS
 */
const ffi = require('ffi'),
    ref = require('ref');

/**
 * VARS
 */
let libA1 = null;
let funcs = [];

/**
 * Response Types for consuming clients
 * OK: ok, 
 * ERR: Error
 */
exports.ResponseTypes = {
    SUCCESS: "OK",
    ERROR: "FAILURE"
};

/**
 * initialize() 
 * 
 * uses FFI to initialize the liba1.so shared object 
 * file and binds to the supplised functions
 *  [{
 *      FuncName: "GetHDInfo",
 *      ReturnType: "int",
 *      Parameters: ["string", "string"]
 *  },...]
 */
exports.initialize = (funcsToBind) => {
    try {
        libA1 = ffi.DynamicLibrary('/usr/lib/libA1.so');
        if (funcsToBind) {
            for (let i = 0; i < funcsToBind.length; i++) {
                const funcObject = funcsToBind[i];
                const funcName = funcObject.FunctionName;
                const funcReturnType = funcObject.ReturnType;
                const funcParameters = funcObject.Parameters || [];

                let funcPointer = libA1.get(funcName);
                let func = ffi.ForeignFunction(funcPointer, funcReturnType, funcParameters);

                let obj = {
                    functionName: funcName,
                    func
                }
                funcs.push(obj)
            }
        }
    }
    catch (err) {
        console.log(err)
        return err;
    }
};

/**
 * runs the function specified
 */
exports.run = (functionName) => {
    switch (functionName.toLowerCase()) {
        case "gethdinfo":
            let f = getFunction(functionName)
            if (f) {
                return _getHdInfo(f);
            }
            break;
    }
};

/*********************
 * HELPER FUNCTIONS *
 *********************/

//generic return
const Ok = (rObject) => {
    return {
        status: "OK",
        responseObject: rObject
    };
};

//helper function to see if functions array contains the function being ran
const getFunction = (func) => {
    const foundFunction = funcs.filter((f) => {
        return f.functionName.toLowerCase() === func.toLowerCase();
    });

    if (foundFunction.length == 1) {
        return foundFunction[0];
    }

    throw new Error("Function either does not exist or not binded correctly");
};

/*********************
 * PRIVATE FUNCTIONS *
 *********************/

//get hd info binding
const _getHdInfo = (f) => {
    try {
        var modelPtr = Buffer.alloc(41);
        var serialNumberPtr = Buffer.alloc(21);

        var didSucceed = f.func(modelPtr, serialNumberPtr);
        if (didSucceed) {
            var hdInfo = {
                model: ref.readCString(modelPtr, 0).trim(),
                serialNo: ref.readCString(serialNumberPtr, 0).trim()
            }
            return Ok(hdInfo);
        }

        throw new Error("Function did not succeed");
    }
    catch (err) {
        throw err;
    }
};


