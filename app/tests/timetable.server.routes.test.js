'use strict';

var should = require('should'),
	request = require('supertest'),
	app = require('../../server'),
	mongoose = require('mongoose'),
	User = mongoose.model('User'),
	Timetable = mongoose.model('Timetable'),
	agent = request.agent(app);

/**
 * Globals
 */
var credentials, user, timetable;

/**
 * Timetable routes tests
 */
describe('Timetable CRUD tests', function() {
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

		// Save a user to the test db and create new Timetable
		user.save(function() {
			timetable = {
				name: 'Timetable Name'
			};

			done();
		});
	});

	it('should be able to save Timetable instance if logged in', function(done) {
		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Timetable
				agent.post('/timetables')
					.send(timetable)
					.expect(200)
					.end(function(timetableSaveErr, timetableSaveRes) {
						// Handle Timetable save error
						if (timetableSaveErr) done(timetableSaveErr);

						// Get a list of Timetables
						agent.get('/timetables')
							.end(function(timetablesGetErr, timetablesGetRes) {
								// Handle Timetable save error
								if (timetablesGetErr) done(timetablesGetErr);

								// Get Timetables list
								var timetables = timetablesGetRes.body;

								// Set assertions
								(timetables[0].user._id).should.equal(userId);
								(timetables[0].name).should.match('Timetable Name');

								// Call the assertion callback
								done();
							});
					});
			});
	});

	it('should not be able to save Timetable instance if not logged in', function(done) {
		agent.post('/timetables')
			.send(timetable)
			.expect(401)
			.end(function(timetableSaveErr, timetableSaveRes) {
				// Call the assertion callback
				done(timetableSaveErr);
			});
	});

	it('should not be able to save Timetable instance if no name is provided', function(done) {
		// Invalidate name field
		timetable.name = '';

		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Timetable
				agent.post('/timetables')
					.send(timetable)
					.expect(400)
					.end(function(timetableSaveErr, timetableSaveRes) {
						// Set message assertion
						(timetableSaveRes.body.message).should.match('Please fill Timetable name');
						
						// Handle Timetable save error
						done(timetableSaveErr);
					});
			});
	});

	it('should be able to update Timetable instance if signed in', function(done) {
		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Timetable
				agent.post('/timetables')
					.send(timetable)
					.expect(200)
					.end(function(timetableSaveErr, timetableSaveRes) {
						// Handle Timetable save error
						if (timetableSaveErr) done(timetableSaveErr);

						// Update Timetable name
						timetable.name = 'WHY YOU GOTTA BE SO MEAN?';

						// Update existing Timetable
						agent.put('/timetables/' + timetableSaveRes.body._id)
							.send(timetable)
							.expect(200)
							.end(function(timetableUpdateErr, timetableUpdateRes) {
								// Handle Timetable update error
								if (timetableUpdateErr) done(timetableUpdateErr);

								// Set assertions
								(timetableUpdateRes.body._id).should.equal(timetableSaveRes.body._id);
								(timetableUpdateRes.body.name).should.match('WHY YOU GOTTA BE SO MEAN?');

								// Call the assertion callback
								done();
							});
					});
			});
	});

	it('should be able to get a list of Timetables if not signed in', function(done) {
		// Create new Timetable model instance
		var timetableObj = new Timetable(timetable);

		// Save the Timetable
		timetableObj.save(function() {
			// Request Timetables
			request(app).get('/timetables')
				.end(function(req, res) {
					// Set assertion
					res.body.should.be.an.Array.with.lengthOf(1);

					// Call the assertion callback
					done();
				});

		});
	});


	it('should be able to get a single Timetable if not signed in', function(done) {
		// Create new Timetable model instance
		var timetableObj = new Timetable(timetable);

		// Save the Timetable
		timetableObj.save(function() {
			request(app).get('/timetables/' + timetableObj._id)
				.end(function(req, res) {
					// Set assertion
					res.body.should.be.an.Object.with.property('name', timetable.name);

					// Call the assertion callback
					done();
				});
		});
	});

	it('should be able to delete Timetable instance if signed in', function(done) {
		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Timetable
				agent.post('/timetables')
					.send(timetable)
					.expect(200)
					.end(function(timetableSaveErr, timetableSaveRes) {
						// Handle Timetable save error
						if (timetableSaveErr) done(timetableSaveErr);

						// Delete existing Timetable
						agent.delete('/timetables/' + timetableSaveRes.body._id)
							.send(timetable)
							.expect(200)
							.end(function(timetableDeleteErr, timetableDeleteRes) {
								// Handle Timetable error error
								if (timetableDeleteErr) done(timetableDeleteErr);

								// Set assertions
								(timetableDeleteRes.body._id).should.equal(timetableSaveRes.body._id);

								// Call the assertion callback
								done();
							});
					});
			});
	});

	it('should not be able to delete Timetable instance if not signed in', function(done) {
		// Set Timetable user 
		timetable.user = user;

		// Create new Timetable model instance
		var timetableObj = new Timetable(timetable);

		// Save the Timetable
		timetableObj.save(function() {
			// Try deleting Timetable
			request(app).delete('/timetables/' + timetableObj._id)
			.expect(401)
			.end(function(timetableDeleteErr, timetableDeleteRes) {
				// Set message assertion
				(timetableDeleteRes.body.message).should.match('User is not logged in');

				// Handle Timetable error error
				done(timetableDeleteErr);
			});

		});
	});

	afterEach(function(done) {
		User.remove().exec();
		Timetable.remove().exec();
		done();
	});
});