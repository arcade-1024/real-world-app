// const { PassportStatic } = require("passport");
// const localStrategy = require("passport-local").Strategy;
// const User = require("../model/userModel");
// const findByCredentials = require("./authenticateUser");
// function initializePassport(passport) {
// 	const authenticateUser = async (email, password, done) => {
// 		try {
// 			const user = await findByCredentials(email, password);
// 			if (!user) {
// 				return done("No user exists");
// 			}
// 			return done(null, user);
// 		} catch (e) {
// 			return done(e);
// 		}
// 	};
// 	passport.use(new localStrategy({ usernameField: "email" }, authenticateUser));

// }

// module.exports = initializePassport;

const jwt = require("jsonwebtoken");
const User = require("../model/userModel");

const auth = async (req, res, next) => {
	try {
		const token = req.header("Authorization").replace("Bearer ", "");
		const decoded = jwt.verify(token, "testingIt");
		const user = await User.findOne({
			_id: decoded._id,
			"tokens.token": token,
		});

		if (!user) {
			throw new Error();
		}
		console.log(user);
		req.user = user;
		next();
	} catch (e) {
		res.status(401).send({ error: "Please authenticate." });
	}
};

module.exports = auth;
