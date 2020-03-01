const User = require('./../models/User')
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const config = require('../config');

module.exports = {
	loginAttempt: (req, res, next) => {
		User.findOne({ email: req.body.email }, function (err, user) {
			if (err) return res.status(500).send('Error on the server.');
			if (!user) return res.status(404).send('No user found.');
			var passwordIsValid = bcrypt.compareSync(req.body.password, user.password);

			if (!passwordIsValid) {
				return res.status(401).send({ auth: false, token: null });
			}
			var token = jwt.sign({ id: user._id }, config.secret, {
				expiresIn: 86400
			});
			res.status(200).send({ auth: true, token: token });
		});
	},
	checkToken: (req, res, next) => {
		var token = req.headers['x-access-token'];
		if (!token) return res.status(401).send({ auth: false, message: 'No token provided.' });
		jwt.verify(token, config.secret, function (err, decoded) {
			if (err) return res.status(500).send({ auth: false, message: 'Failed to authenticate token.' });
			res.status(200).send(decoded);
		});
	}
}