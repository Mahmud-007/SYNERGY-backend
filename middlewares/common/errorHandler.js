const createError = require("http-errors");

function notFoundHandler(res, req, next){
    next(createError(404, "Not Found"));
}

function errorHandler (error, req, res, next){
    res.json({
        message : error.message,
        title : `${process.env.APP_NAME} | Error Page`
    });
    console.log(error.message);
}

module.exports = {errorHandler, notFoundHandler};
