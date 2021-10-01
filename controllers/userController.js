const User = require("../models/People");
const bcrypt = require("bcrypt");


//get users
function getUsers (req, res, next){
    res.json({
        title : `${process.env.APP_NAME} | getUsers`
    });
    
}

//add users
async function addUser (req, res, next){
     console.log(req.body);
     //res.json(req.query)
     res.json(req.body);
     const salt =  await bcrypt.genSalt(10);
     const hashedPassword = await bcrypt.hashSync(req.body.password,salt);
     const user = new User({
        ...req.body,
        password : hashedPassword,
        // name : req.body.name,
        // email : req.body.email,
        // mobile : req.body.mobile,
        // password : hashedPassword,
        // avater : req.body.avater,
        // role : req.body.role
        
     });
     try{
        user.save();
        res.json({
            message : "User added"
        });
    }catch(error){
        console.log(error)
        res.json({
            message : error.message
        });
    }
}
module.exports = {
    getUsers,
    addUser
};