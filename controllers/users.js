const User = require('../models/user')
const moment = require('moment')
const _ = require('lodash')
let bcrypt = require('bcryptjs');

let listUsers = (status, page = 1, count = 1000) => {
	return new Promise(function(resolve, reject) {
		User.paginate({}, {page: page, limit: count})
			.then((data) => {
				resolve(data)
			})
			.catch((err) => {
				reject(err)
			});
	})
}

let insertUser = (data) => {
	return new Promise((resolve, reject) => {

		if (data.password !== data.passwordAgain) {
			reject('password mismatch');
		}

		bcrypt.genSalt(10, function(err, salt) {
			bcrypt.hash(data.password, salt, function(err, hash) {

				data.password = hash;
				User.create(data), (err, user) => {
					if (err) { reject(err); }
					resolve(user);
				}

			});
		});
	})
}

let updateUser = (data, id) => {
	return new Promise((resolve, reject) => {
		resolve(data);

		if (data.newPassword !== '') {
			if (data.newPassword !== data.newPasswordAgain) {
				reject('password mismatch');
			} else {
				bcrypt.genSalt(10, function(err, salt) {
					bcrypt.hash(data.newPassword, salt, function(err, hash) {
						data.password = hash;
						User.findOneAndUpdate({
							_id: id
						}, {
							$set: data
						}).then((user) => {
							if (!user) {
								reject();
							}
							resolve(user);
						}).catch((e) => {
							reject(e);
						})
					});
				});
			}
		} else {
			_.pull(data, 'newPassword', 'newPasswordAgain');
			User.findOneAndUpdate({
				_id: id
			}, {
				$set: data
			}).then((user) => {
				if (!user) {
					reject();
				}
				resolve(user);
			}).catch((e) => {
				reject(e);
			})
		}
	})
}

let getUserById = (id) => {
	return new Promise(function(resolve, reject) {
		User.findOne({_id: id})
			.then((data) => {
				resolve(data)
			})
			.catch((err) => {
				reject(err)
			});
	})
}

module.exports = {
	listUsers,
	insertUser,
	updateUser,
	getUserById
}