'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	errorHandler = require('./errors.server.controller'),
	Timetable = mongoose.model('Timetable'),
	_ = require('lodash');

/**
 * Create a Timetable
 */
exports.create = function(req, res) {
	var timetable = new Timetable(req.body);
	timetable.user = req.user;

	timetable.save(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(timetable);
		}
	});
};

/**
 * Show the current Timetable
 */
exports.read = function(req, res) {
	res.jsonp(req.timetable);
};

/**
 * Update a Timetable
 */
exports.update = function(req, res) {
	var timetable = req.timetable ;

	timetable = _.extend(timetable , req.body);

	timetable.save(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(timetable);
		}
	});
};

/**
 * Delete an Timetable
 */
exports.delete = function(req, res) {
	var timetable = req.timetable ;

	timetable.remove(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(timetable);
		}
	});
};

/**
 * List of Timetables
 */
exports.list = function(req, res) { 
	Timetable.find().sort('-created').populate('user', 'displayName').exec(function(err, timetables) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(timetables);
		}
	});
};

/**
 * Timetable middleware
 */
exports.timetableByID = function(req, res, next, id) { 
	Timetable.findById(id).populate('user', 'displayName').exec(function(err, timetable) {
		if (err) return next(err);
		if (! timetable) return next(new Error('Failed to load Timetable ' + id));
		req.timetable = timetable ;
		next();
	});
};

/**
 * Timetable authorization middleware
 */
exports.hasAuthorization = function(req, res, next) {
	if (req.timetable.user.id !== req.user.id) {
		return res.status(403).send('User is not authorized');
	}
	next();
};
