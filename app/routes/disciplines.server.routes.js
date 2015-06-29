'use strict';

module.exports = function(app) {
	var users = require('../../app/controllers/users.server.controller');
	var disciplines = require('../../app/controllers/disciplines.server.controller');

	// Disciplines Routes
	app.route('/disciplines')
		.get(disciplines.list)
		.post(users.requiresLogin, disciplines.create);

	app.route('/disciplines/:disciplineId')
		.get(disciplines.read)
		.put(users.requiresLogin, disciplines.hasAuthorization, disciplines.update)
		.delete(users.requiresLogin, disciplines.hasAuthorization, disciplines.delete);

	// Finish by binding the Discipline middleware
	app.param('disciplineId', disciplines.disciplineByID);
};
