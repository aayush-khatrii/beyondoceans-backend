export class ErrorHandler extends Error{
    constructor(msg, status, customErrCode) {
        super(msg)
        this.message = msg;
        this.statusCode = status;
        this.customErrCode = customErrCode
    }

static validationError(message = "All Fields are required", customErrCode, errCode = 422){
    throw new ErrorHandler(message, errCode, customErrCode)
}

static notFoundError(message = "Not Found", customErrCode, errCode = 404){
    throw new ErrorHandler(message, errCode, customErrCode);
}
static notAcceptableError(message = "Not Acceptable request", customErrCode, errCode = 406){
    throw new ErrorHandler(message, errCode, customErrCode);
}

static internalServerError(message = "Internal server error.", customErrCode, errCode = 500){
    throw new ErrorHandler(message, errCode, customErrCode);
}

static sessionError(message = "Session Error", customErrCode, errCode = 403,){
    throw new ErrorHandler(message, errCode, customErrCode);
}

}