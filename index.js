const express = require('express');
const cookieParser = require('cookie-parser');
const dotenv = require("dotenv");


//internal imports
const  {errorHandler, notFoundHandler} = require("./middlewares/common/errorHandler");
const {dbConnection} = require("./middlewares/common/database");
const loginRouter = require("./routers/loginRouter");
const userRouter = require("./routers/userRouter");


const app = express();
dotenv.config();

// Database Connection
dbConnection;

// Request Parser
app.use(express.json());
// app.use(express.urlencoded({ extended: true }));


// Cookie Parser
app.use(cookieParser(process.env.COOKIE_SECRET));

// Routing
app.use('/api',loginRouter,userRouter);

// Error Handleing
app.use(notFoundHandler);
app.use(errorHandler);

// App Listening
app.listen(process.env.PORT, () => {
  console.log(`app listening at http://localhost:${process.env.PORT}`);
});