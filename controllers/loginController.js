function loginController (req, res, next){
    res.json({
        title : `${process.env.APP_NAME} | Login`
    });
}

module.exports = loginController;