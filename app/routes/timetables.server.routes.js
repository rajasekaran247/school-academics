'use strict';

module.exports = function(app) {
	var users = require('../../app/controllers/users.server.controller');
	var timetables = require('../../app/controllers/timetables.server.controller');

	// Timetables Routes
	app.route('/timetables')
		.get(timetables.list)
		.post(users.requiresLogin, timetables.create);

	app.route('/timetables/:timetableId')
		.get(timetables.read)
		.put(users.requiresLogin, timetables.hasAuthorization, timetables.update)
		.delete(users.requiresLogin, timetables.hasAuthorization, timetables.delete);

	// Finish by binding the Timetable middleware
	app.param('timetableId', timetables.timetableByID);
};
