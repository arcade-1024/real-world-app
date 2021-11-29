const express = require("express");
const passport = require("passport");
const User = require("../model/userModel");
const router = express.Router();
const findByCredentials = require("../middleware/authenticateUser");
const generateAuthToken = require("../middleware/generateToken");
const auth = require("../middleware/authentication");


//# register user
router.post("/users", auth, async (req, res) => {
	const newUser = new User(req.body);
	try {
		await newUser.save();
		res.send("successfully registered user");
	} catch (e) {
		res.status(400).send(e);
	}
});

//# get all users
router.get("/users", auth, async (req, res) => {
	try {
		const users = await User.find({});
		res.send(users);
	} catch (e) {
		res.status(400).send(e);
	}
});

//# get profile
router.get("/user/:name", auth, async (req, res) => {
	const name = req.params.name;
	try {
		const user = await User.findOne({ name });
		if (!user) {
			res.status(400).send();
		}
		res.send(user);
	} catch (e) {
		res.status(400).send(e);
	}
});

//# update user
router.patch("/user/:id", auth, async (req, res) => {
	const _id = req.params.id;
	const updates = Object.keys(req.body);
	try {
		const user = await User.findById(_id);
		updates.forEach((update) => (user[update] = req.body[update]));

		await user.save();
		if (!user) {
			return res.status(404).send();
		}
		res.send(user);
	} catch (e) {
		res.status(400).send(e);
	}
});


router.post("/users/login", async (req, res) => {
	const token = await generateAuthToken(req.body.email);
	try {
		const user = await findByCredentials(req.body.email, req.body.password);
		if (!user) {
			throw new Error("Email or password incorrect");
		}
		res.send({ user, token });
	} catch (e) {
		res.status(404).send(e);
	}
});

router.post("/users/logout", auth, async (req, res) => {
	try {
		const mainToken = req.header("Authorization").replace("Bearer ", "");
		req.user.tokens = req.user.tokens.filter((token) => {
			return token.token !== mainToken;
		});
		req.user.save();
		res.send("logout successfully");
	} catch (e) {
		res.status(500).send();
	}
});
module.exports = router;
