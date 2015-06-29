'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	Schema = mongoose.Schema;

/**
 * Discipline Schema
 */
var DisciplineSchema = new Schema({
	name: {
		type: String,
		default: '',
		required: 'Please fill Discipline name',
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

mongoose.model('Discipline', DisciplineSchema);