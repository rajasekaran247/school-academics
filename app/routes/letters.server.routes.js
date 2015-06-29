'use strict';

module.exports = function(app) {
	var users = require('../../app/controllers/users.server.controller');
	var letters = require('../../app/controllers/letters.server.controller');

	// Letters Routes
	app.route('/letters')
		.get(letters.list)
		.post(users.requiresLogin, letters.create);

	app.route('/letters/:letterId')
		.get(letters.read)
		.put(users.requiresLogin, letters.hasAuthorization, letters.update)
		.delete(users.requiresLogin, letters.hasAuthorization, letters.delete);

	// Finish by binding the Letter middleware
	app.param('letterId', letters.letterByID);
};
