'use strict';

module.exports = function(app) {
	var users = require('../../app/controllers/users.server.controller');
	var examinations = require('../../app/controllers/examinations.server.controller');

	// Examinations Routes
	app.route('/examinations')
		.get(examinations.list)
		.post(users.requiresLogin, examinations.create);

	app.route('/examinations/:examinationId')
		.get(examinations.read)
		.put(users.requiresLogin, examinations.hasAuthorization, examinations.update)
		.delete(users.requiresLogin, examinations.hasAuthorization, examinations.delete);

	// Finish by binding the Examination middleware
	app.param('examinationId', examinations.examinationByID);
};
