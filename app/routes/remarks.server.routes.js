'use strict';

module.exports = function(app) {
	var users = require('../../app/controllers/users.server.controller');
	var remarks = require('../../app/controllers/remarks.server.controller');

	// Remarks Routes
	app.route('/remarks')
		.get(remarks.list)
		.post(users.requiresLogin, remarks.create);

	app.route('/remarks/:remarkId')
		.get(remarks.read)
		.put(users.requiresLogin, remarks.hasAuthorization, remarks.update)
		.delete(users.requiresLogin, remarks.hasAuthorization, remarks.delete);

	// Finish by binding the Remark middleware
	app.param('remarkId', remarks.remarkByID);
};
