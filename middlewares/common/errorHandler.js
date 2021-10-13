const createError = require("http-errors");

function notFoundHandler(res, req, next){
    next(createError(404, "Not Found"));
}

function errorHandler (error, req, res, next){
    res.status(error.statusCode).json({
        message: error.message,
        data: error.data,
        title : `${process.env.APP_NAME} | Error Page`
    });
    console.log(error.message);
}

module.exports = {errorHandler, notFoundHandler};
