'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	errorHandler = require('./errors.server.controller'),
	Remark = mongoose.model('Remark'),
	_ = require('lodash');

/**
 * Create a Remark
 */
exports.create = function(req, res) {
	var remark = new Remark(req.body);
	remark.user = req.user;

	remark.save(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(remark);
		}
	});
};

/**
 * Show the current Remark
 */
exports.read = function(req, res) {
	res.jsonp(req.remark);
};

/**
 * Update a Remark
 */
exports.update = function(req, res) {
	var remark = req.remark ;

	remark = _.extend(remark , req.body);

	remark.save(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(remark);
		}
	});
};

/**
 * Delete an Remark
 */
exports.delete = function(req, res) {
	var remark = req.remark ;

	remark.remove(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(remark);
		}
	});
};

/**
 * List of Remarks
 */
exports.list = function(req, res) { 
	Remark.find().sort('-created').populate('user', 'displayName').exec(function(err, remarks) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(remarks);
		}
	});
};

/**
 * Remark middleware
 */
exports.remarkByID = function(req, res, next, id) { 
	Remark.findById(id).populate('user', 'displayName').exec(function(err, remark) {
		if (err) return next(err);
		if (! remark) return next(new Error('Failed to load Remark ' + id));
		req.remark = remark ;
		next();
	});
};

/**
 * Remark authorization middleware
 */
exports.hasAuthorization = function(req, res, next) {
	if (req.remark.user.id !== req.user.id) {
		return res.status(403).send('User is not authorized');
	}
	next();
};
