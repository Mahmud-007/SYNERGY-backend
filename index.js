const express = require('express');
const cookieParser = require('cookie-parser');
const dotenv = require('dotenv');
const socket = require('socket.io');
const http = require('http');

//internal imports
const {
	errorHandler,
	notFoundHandler,
} = require('./middlewares/common/errorHandler');
const { dbConnection } = require('./middlewares/common/database');

// socket
const { Users } = require('./helper/users');
const privateMessage = require('./socket/privateMessage');
const groupMessage = require('./socket/groupMessage');

//routes
const userRoutes = require('./routers/user');
const authRoutes = require('./routers/auth');
const roomRoutes = require('./routers/room');
const conversationRoutes = require('./routers/conversation');
const searchRoutes = require('./routers/search');

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
app.use('/user', userRoutes);
app.use('/room', roomRoutes);
app.use('/conversation', conversationRoutes);
app.use('/search', searchRoutes);

// Error Handleing
app.use(notFoundHandler);
app.use(errorHandler);

// App Listening

// app.listen(process.env.PORT, () => {
// 	console.log(`app listening at http://localhost:${process.env.PORT}`);
// });

const server = http.createServer(app);
const io = socket(server, {
	cors: 'http://localhost:8080',
});

server.listen(process.env.PORT, () => {
	console.log(`app listening at http://localhost:${process.env.PORT}`);
});

privateMessage(io);
groupMessage(io, Users);
