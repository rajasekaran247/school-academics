'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	errorHandler = require('./errors.server.controller'),
	Discipline = mongoose.model('Discipline'),
	_ = require('lodash');

/**
 * Create a Discipline
 */
exports.create = function(req, res) {
	var discipline = new Discipline(req.body);
	discipline.user = req.user;

	discipline.save(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(discipline);
		}
	});
};

/**
 * Show the current Discipline
 */
exports.read = function(req, res) {
	res.jsonp(req.discipline);
};

/**
 * Update a Discipline
 */
exports.update = function(req, res) {
	var discipline = req.discipline ;

	discipline = _.extend(discipline , req.body);

	discipline.save(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(discipline);
		}
	});
};

/**
 * Delete an Discipline
 */
exports.delete = function(req, res) {
	var discipline = req.discipline ;

	discipline.remove(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(discipline);
		}
	});
};

/**
 * List of Disciplines
 */
exports.list = function(req, res) { 
	Discipline.find().sort('-created').populate('user', 'displayName').exec(function(err, disciplines) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(disciplines);
		}
	});
};

/**
 * Discipline middleware
 */
exports.disciplineByID = function(req, res, next, id) { 
	Discipline.findById(id).populate('user', 'displayName').exec(function(err, discipline) {
		if (err) return next(err);
		if (! discipline) return next(new Error('Failed to load Discipline ' + id));
		req.discipline = discipline ;
		next();
	});
};

/**
 * Discipline authorization middleware
 */
exports.hasAuthorization = function(req, res, next) {
	if (req.discipline.user.id !== req.user.id) {
		return res.status(403).send('User is not authorized');
	}
	next();
};
