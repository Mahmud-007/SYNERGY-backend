const mongoose = require('mongoose');
const dotenv = require('dotenv');

dotenv.config();

const dbConnection = mongoose.connect(process.env.DATABASE, {
    useNewUrlParser: true,
    useUnifiedTopology: true
})
.then(()=>{
    console.log("Database Connected");
})
.catch((error)=>{
    console.log(error.message);
});

exports.module = dbConnection;