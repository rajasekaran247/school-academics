'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	errorHandler = require('./errors.server.controller'),
	Letter = mongoose.model('Letter'),
	_ = require('lodash');

/**
 * Create a Letter
 */
exports.create = function(req, res) {
	var letter = new Letter(req.body);
	letter.user = req.user;

	letter.save(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(letter);
		}
	});
};

/**
 * Show the current Letter
 */
exports.read = function(req, res) {
	res.jsonp(req.letter);
};

/**
 * Update a Letter
 */
exports.update = function(req, res) {
	var letter = req.letter ;

	letter = _.extend(letter , req.body);

	letter.save(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(letter);
		}
	});
};

/**
 * Delete an Letter
 */
exports.delete = function(req, res) {
	var letter = req.letter ;

	letter.remove(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(letter);
		}
	});
};

/**
 * List of Letters
 */
exports.list = function(req, res) { 
	Letter.find().sort('-created').populate('user', 'displayName').exec(function(err, letters) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(letters);
		}
	});
};

/**
 * Letter middleware
 */
exports.letterByID = function(req, res, next, id) { 
	Letter.findById(id).populate('user', 'displayName').exec(function(err, letter) {
		if (err) return next(err);
		if (! letter) return next(new Error('Failed to load Letter ' + id));
		req.letter = letter ;
		next();
	});
};

/**
 * Letter authorization middleware
 */
exports.hasAuthorization = function(req, res, next) {
	if (req.letter.user.id !== req.user.id) {
		return res.status(403).send('User is not authorized');
	}
	next();
};
