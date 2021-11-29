require("dotenv").config();
const express = require("express");
require("./db/mongoose");
const UserRouter = require("./routers/userRouter");
const passport = require("passport");
const initializeFunction = require("./middleware/authentication");
const flash = require("express-flash");
const session = require("express-session");
const app = express();

app.use(express.json());

// initializeFunction(passport);

// app.use(flash());

// app.use(
// 	session({
// 		secret: process.env.SESSION_SECRET,
// 		resave: false,
// 		saveUninitialized: false,
// 	})
// );

// app.use(passport.initialize());
// app.use(passport.session());

const port = 3000 || process.env.PORT;


app.use(UserRouter);

app.listen(port, () => {
	return console.log(`server is listening on ${port}`);
});
