'use strict';

var should = require('should'),
	request = require('supertest'),
	app = require('../../server'),
	mongoose = require('mongoose'),
	User = mongoose.model('User'),
	Remark = mongoose.model('Remark'),
	agent = request.agent(app);

/**
 * Globals
 */
var credentials, user, remark;

/**
 * Remark routes tests
 */
describe('Remark CRUD tests', function() {
	beforeEach(function(done) {
		// Create user credentials
		credentials = {
			username: 'username',
			password: 'password'
		};

		// Create a new user
		user = new User({
			firstName: 'Full',
			lastName: 'Name',
			displayName: 'Full Name',
			email: 'test@test.com',
			username: credentials.username,
			password: credentials.password,
			provider: 'local'
		});

		// Save a user to the test db and create new Remark
		user.save(function() {
			remark = {
				name: 'Remark Name'
			};

			done();
		});
	});

	it('should be able to save Remark instance if logged in', function(done) {
		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Remark
				agent.post('/remarks')
					.send(remark)
					.expect(200)
					.end(function(remarkSaveErr, remarkSaveRes) {
						// Handle Remark save error
						if (remarkSaveErr) done(remarkSaveErr);

						// Get a list of Remarks
						agent.get('/remarks')
							.end(function(remarksGetErr, remarksGetRes) {
								// Handle Remark save error
								if (remarksGetErr) done(remarksGetErr);

								// Get Remarks list
								var remarks = remarksGetRes.body;

								// Set assertions
								(remarks[0].user._id).should.equal(userId);
								(remarks[0].name).should.match('Remark Name');

								// Call the assertion callback
								done();
							});
					});
			});
	});

	it('should not be able to save Remark instance if not logged in', function(done) {
		agent.post('/remarks')
			.send(remark)
			.expect(401)
			.end(function(remarkSaveErr, remarkSaveRes) {
				// Call the assertion callback
				done(remarkSaveErr);
			});
	});

	it('should not be able to save Remark instance if no name is provided', function(done) {
		// Invalidate name field
		remark.name = '';

		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Remark
				agent.post('/remarks')
					.send(remark)
					.expect(400)
					.end(function(remarkSaveErr, remarkSaveRes) {
						// Set message assertion
						(remarkSaveRes.body.message).should.match('Please fill Remark name');
						
						// Handle Remark save error
						done(remarkSaveErr);
					});
			});
	});

	it('should be able to update Remark instance if signed in', function(done) {
		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Remark
				agent.post('/remarks')
					.send(remark)
					.expect(200)
					.end(function(remarkSaveErr, remarkSaveRes) {
						// Handle Remark save error
						if (remarkSaveErr) done(remarkSaveErr);

						// Update Remark name
						remark.name = 'WHY YOU GOTTA BE SO MEAN?';

						// Update existing Remark
						agent.put('/remarks/' + remarkSaveRes.body._id)
							.send(remark)
							.expect(200)
							.end(function(remarkUpdateErr, remarkUpdateRes) {
								// Handle Remark update error
								if (remarkUpdateErr) done(remarkUpdateErr);

								// Set assertions
								(remarkUpdateRes.body._id).should.equal(remarkSaveRes.body._id);
								(remarkUpdateRes.body.name).should.match('WHY YOU GOTTA BE SO MEAN?');

								// Call the assertion callback
								done();
							});
					});
			});
	});

	it('should be able to get a list of Remarks if not signed in', function(done) {
		// Create new Remark model instance
		var remarkObj = new Remark(remark);

		// Save the Remark
		remarkObj.save(function() {
			// Request Remarks
			request(app).get('/remarks')
				.end(function(req, res) {
					// Set assertion
					res.body.should.be.an.Array.with.lengthOf(1);

					// Call the assertion callback
					done();
				});

		});
	});


	it('should be able to get a single Remark if not signed in', function(done) {
		// Create new Remark model instance
		var remarkObj = new Remark(remark);

		// Save the Remark
		remarkObj.save(function() {
			request(app).get('/remarks/' + remarkObj._id)
				.end(function(req, res) {
					// Set assertion
					res.body.should.be.an.Object.with.property('name', remark.name);

					// Call the assertion callback
					done();
				});
		});
	});

	it('should be able to delete Remark instance if signed in', function(done) {
		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Remark
				agent.post('/remarks')
					.send(remark)
					.expect(200)
					.end(function(remarkSaveErr, remarkSaveRes) {
						// Handle Remark save error
						if (remarkSaveErr) done(remarkSaveErr);

						// Delete existing Remark
						agent.delete('/remarks/' + remarkSaveRes.body._id)
							.send(remark)
							.expect(200)
							.end(function(remarkDeleteErr, remarkDeleteRes) {
								// Handle Remark error error
								if (remarkDeleteErr) done(remarkDeleteErr);

								// Set assertions
								(remarkDeleteRes.body._id).should.equal(remarkSaveRes.body._id);

								// Call the assertion callback
								done();
							});
					});
			});
	});

	it('should not be able to delete Remark instance if not signed in', function(done) {
		// Set Remark user 
		remark.user = user;

		// Create new Remark model instance
		var remarkObj = new Remark(remark);

		// Save the Remark
		remarkObj.save(function() {
			// Try deleting Remark
			request(app).delete('/remarks/' + remarkObj._id)
			.expect(401)
			.end(function(remarkDeleteErr, remarkDeleteRes) {
				// Set message assertion
				(remarkDeleteRes.body.message).should.match('User is not logged in');

				// Handle Remark error error
				done(remarkDeleteErr);
			});

		});
	});

	afterEach(function(done) {
		User.remove().exec();
		Remark.remove().exec();
		done();
	});
});