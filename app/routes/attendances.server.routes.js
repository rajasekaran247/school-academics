'use strict';

module.exports = function(app) {
	var users = require('../../app/controllers/users.server.controller');
	var attendances = require('../../app/controllers/attendances.server.controller');

	// Attendances Routes
	app.route('/attendances')
		.get(attendances.list)
		.post(users.requiresLogin, attendances.create);

	app.route('/attendances/:attendanceId')
		.get(attendances.read)
		.put(users.requiresLogin, attendances.hasAuthorization, attendances.update)
		.delete(users.requiresLogin, attendances.hasAuthorization, attendances.delete);

	// Finish by binding the Attendance middleware
	app.param('attendanceId', attendances.attendanceByID);
};
