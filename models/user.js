const mongoose = require('mongoose')
const mongoosePaginate = require('mongoose-paginate')
const _ = require('lodash')
const jwt = require('jsonwebtoken')
const bcrypt = require('bcryptjs')

let UserSchema = new mongoose.Schema({
	emailAddress: {
		type: String,
		unique: true
	},
	lastName: String,
	firstName: String,
	password: String,
	passwordResetToken: String,
	passwordResetExpires: Date,
	tokens: Array
}, {timestamps: true });

UserSchema.plugin(mongoosePaginate);
let User = module.exports = mongoose.model('User', UserSchema);

module.exports.getUserByUsername = (username, callback) => {
	let query = {emailAddress: {'$regex': username ,$options:'i'}};
	User.findOne(query, callback);
};

module.exports.comparePassword = (candidatePassword, hash, callback) => {
	bcrypt.compare(candidatePassword, hash, function(err, isMatch) {
		if (err) throw err;
		callback(null, isMatch);
	});
}

module.exports.getUserById = (id, callback) => {
	User.findById(id, callback);
};

// generating a hash
UserSchema.methods.generateHash = function(password) {
	return bcrypt.hashSync(password, bcrypt.genSaltSync(10), null);
};

// checking if password is valid
UserSchema.methods.validPassword = function(password) {
	return bcrypt.compareSync(password, this.local.password);
};