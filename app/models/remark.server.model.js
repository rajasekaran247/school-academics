'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	Schema = mongoose.Schema;

/**
 * Remark Schema
 */
var RemarkSchema = new Schema({
	name: {
		type: String,
		default: '',
		required: 'Please fill Remark name',
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

mongoose.model('Remark', RemarkSchema);