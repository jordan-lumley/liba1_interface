const lib = require('./lib');

try {
    let funcs = [{
        FunctionName: "GetHDInfo",
        ReturnType: "int",
        Parameters: ["string", "string"]
    }];

    lib.initialize(funcs);

    var res = lib.run("GetHDInfo");
    if (res.status === lib.ResponseTypes.SUCCESS) {
        console.log(res);
    }
}
catch (err) {
    console.log(err);
}