const User = require("../model/userModel");
const jwt = require("jsonwebtoken");

const generateAuthToken = async function (email) {
	const user = await User.findOne({ email });
	const token = jwt.sign({ _id: user._id.toString() }, "testingIt", {
		expiresIn: "1 day",
	});
	user.tokens = user.tokens.concat({ token });
	await user.save();
	return token;
};

module.exports = generateAuthToken;
