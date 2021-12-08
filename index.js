const express = require('express');
const cookieParser = require('cookie-parser');
const dotenv = require('dotenv');

//internal imports
const {
	errorHandler,
	notFoundHandler,
} = require('./middlewares/common/errorHandler');
const { dbConnection } = require('./middlewares/common/database');

//routes
const userRouter = require('./routers/userRouter');
const authRoutes = require('./routers/auth');
const roomRoutes = require('./routers/roomRouter');

const app = express();
dotenv.config();

// Database Connection
dbConnection;

// Request Parser
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Cookie Parser
app.use(cookieParser(process.env.COOKIE_SECRET));

// CORS Headers
app.use((req, res, next) => {
	res.setHeader('Access-Control-Allow-Origin', 'http://localhost:3000');
	res.setHeader('Access-Control-Allow-Credentials', 'true');
	res.setHeader(
		'Access-Control-Allow-Methods',
		'GET, POST, PUT, PATCH, DELETE'
	);
	res.setHeader(
		'Access-Control-Allow-Headers',
		'Content-Type, Authorization'
	);
	next();
});

// Routing
app.use('/auth', authRoutes);
app.use('/room', roomRoutes);

// Error Handleing
app.use(notFoundHandler);
app.use(errorHandler);

// App Listening
app.listen(process.env.PORT, () => {
	console.log(`app listening at http://localhost:${process.env.PORT}`);
});
