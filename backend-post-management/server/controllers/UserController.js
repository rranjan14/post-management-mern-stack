const User = require('./../models/User')
const bcrypt = require('bcryptjs');

module.exports = {
	addUser: (req, res, next) => {
		if (req.body.password) {
			var hashedPassword = bcrypt.hashSync(req.body.password, 8);
			req.body.password = hashedPassword;
		}
		const saveuser = req.body;
		const user = new User(saveuser);
		if (!saveuser._id) {
			user.save((err, newUser) => {
				if (err)
					res.send(err)
				else if (!newUser)
					res.send(400)
				else
					newUser.password = undefined;
				res.send(newUser)
				next()
			});
		} else {
			User.findById(req.body._id, function (err, user) {
				if (err) return handleError(err);
				user.set(saveuser);
				user.save((err, updateUser) => {
					if (err)
						res.send(err)
					else if (!updateUser)
						res.send(400)
					else
						updateUser.password = undefined; 
					res.send(updateUser)
					next()
				});
			});
		}
	},
	getUser: (req, res, next) => {
		const userid = req.params.id;
		User.findById(userid, { password: 0 }).then((err, user) => {  
			if (err)
				res.send(err)
			else if (!user)
				res.send(404)
			else
				res.send(user)
			next()
		})
	},
	getAllUsers: (req, res, next) => {
		User.find({}, { password: 0 }).then((err, users) => {
			if (err)
				res.send(err)
			else if (!users)
				res.send(404)
			else
				res.send(users)
			next()
		})
	}
}