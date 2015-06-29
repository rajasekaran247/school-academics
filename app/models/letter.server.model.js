'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	Schema = mongoose.Schema;

/**
 * Letter Schema
 */
var LetterSchema = new Schema({
	name: {
		type: String,
		default: '',
		required: 'Please fill Letter name',
		trim: true
	},
	created: {
		type: Date,
		default: Date.now
	},
	user: {
		type: Schema.ObjectId,
		ref: 'User'
	}
});

mongoose.model('Letter', LetterSchema);