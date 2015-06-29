'use strict';

module.exports = function(app) {
	var users = require('../../app/controllers/users.server.controller');
	var feedbacks = require('../../app/controllers/feedbacks.server.controller');

	// Feedbacks Routes
	app.route('/feedbacks')
		.get(feedbacks.list)
		.post(users.requiresLogin, feedbacks.create);

	app.route('/feedbacks/:feedbackId')
		.get(feedbacks.read)
		.put(users.requiresLogin, feedbacks.hasAuthorization, feedbacks.update)
		.delete(users.requiresLogin, feedbacks.hasAuthorization, feedbacks.delete);

	// Finish by binding the Feedback middleware
	app.param('feedbackId', feedbacks.feedbackByID);
};
