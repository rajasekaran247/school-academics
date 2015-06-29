'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	Schema = mongoose.Schema;

/**
 * Timetable Schema
 */
var TimetableSchema = new Schema({
	name: {
		type: String,
		default: '',
		required: 'Please fill Timetable name',
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

mongoose.model('Timetable', TimetableSchema);