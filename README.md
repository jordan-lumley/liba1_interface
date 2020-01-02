# liba1_interface

```
// import the lib
const lib = require('./lib');


try {
    //create array of functions to bind
    let funcs = [{
        FunctionName: "GetHDInfo", //name of function in C lib
        ReturnType: "int", //return type of function in C lib
        Parameters: ["string", "string"] //types for parameters of function in C lib
    }];

    //ALWAYS INITIALIZE FIRST 
    lib.initialize(funcs);

    //call function by name
    var res = lib.run("GetHDInfo");

    //check response
    if (res.status === lib.ResponseTypes.SUCCESS) {
        console.log(res);
    }
}
catch (err) {
    console.log(err);
}
```
