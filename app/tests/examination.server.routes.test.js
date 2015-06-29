'use strict';

var should = require('should'),
	request = require('supertest'),
	app = require('../../server'),
	mongoose = require('mongoose'),
	User = mongoose.model('User'),
	Examination = mongoose.model('Examination'),
	agent = request.agent(app);

/**
 * Globals
 */
var credentials, user, examination;

/**
 * Examination routes tests
 */
describe('Examination CRUD tests', function() {
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

		// Save a user to the test db and create new Examination
		user.save(function() {
			examination = {
				name: 'Examination Name'
			};

			done();
		});
	});

	it('should be able to save Examination instance if logged in', function(done) {
		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Examination
				agent.post('/examinations')
					.send(examination)
					.expect(200)
					.end(function(examinationSaveErr, examinationSaveRes) {
						// Handle Examination save error
						if (examinationSaveErr) done(examinationSaveErr);

						// Get a list of Examinations
						agent.get('/examinations')
							.end(function(examinationsGetErr, examinationsGetRes) {
								// Handle Examination save error
								if (examinationsGetErr) done(examinationsGetErr);

								// Get Examinations list
								var examinations = examinationsGetRes.body;

								// Set assertions
								(examinations[0].user._id).should.equal(userId);
								(examinations[0].name).should.match('Examination Name');

								// Call the assertion callback
								done();
							});
					});
			});
	});

	it('should not be able to save Examination instance if not logged in', function(done) {
		agent.post('/examinations')
			.send(examination)
			.expect(401)
			.end(function(examinationSaveErr, examinationSaveRes) {
				// Call the assertion callback
				done(examinationSaveErr);
			});
	});

	it('should not be able to save Examination instance if no name is provided', function(done) {
		// Invalidate name field
		examination.name = '';

		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Examination
				agent.post('/examinations')
					.send(examination)
					.expect(400)
					.end(function(examinationSaveErr, examinationSaveRes) {
						// Set message assertion
						(examinationSaveRes.body.message).should.match('Please fill Examination name');
						
						// Handle Examination save error
						done(examinationSaveErr);
					});
			});
	});

	it('should be able to update Examination instance if signed in', function(done) {
		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Examination
				agent.post('/examinations')
					.send(examination)
					.expect(200)
					.end(function(examinationSaveErr, examinationSaveRes) {
						// Handle Examination save error
						if (examinationSaveErr) done(examinationSaveErr);

						// Update Examination name
						examination.name = 'WHY YOU GOTTA BE SO MEAN?';

						// Update existing Examination
						agent.put('/examinations/' + examinationSaveRes.body._id)
							.send(examination)
							.expect(200)
							.end(function(examinationUpdateErr, examinationUpdateRes) {
								// Handle Examination update error
								if (examinationUpdateErr) done(examinationUpdateErr);

								// Set assertions
								(examinationUpdateRes.body._id).should.equal(examinationSaveRes.body._id);
								(examinationUpdateRes.body.name).should.match('WHY YOU GOTTA BE SO MEAN?');

								// Call the assertion callback
								done();
							});
					});
			});
	});

	it('should be able to get a list of Examinations if not signed in', function(done) {
		// Create new Examination model instance
		var examinationObj = new Examination(examination);

		// Save the Examination
		examinationObj.save(function() {
			// Request Examinations
			request(app).get('/examinations')
				.end(function(req, res) {
					// Set assertion
					res.body.should.be.an.Array.with.lengthOf(1);

					// Call the assertion callback
					done();
				});

		});
	});


	it('should be able to get a single Examination if not signed in', function(done) {
		// Create new Examination model instance
		var examinationObj = new Examination(examination);

		// Save the Examination
		examinationObj.save(function() {
			request(app).get('/examinations/' + examinationObj._id)
				.end(function(req, res) {
					// Set assertion
					res.body.should.be.an.Object.with.property('name', examination.name);

					// Call the assertion callback
					done();
				});
		});
	});

	it('should be able to delete Examination instance if signed in', function(done) {
		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Examination
				agent.post('/examinations')
					.send(examination)
					.expect(200)
					.end(function(examinationSaveErr, examinationSaveRes) {
						// Handle Examination save error
						if (examinationSaveErr) done(examinationSaveErr);

						// Delete existing Examination
						agent.delete('/examinations/' + examinationSaveRes.body._id)
							.send(examination)
							.expect(200)
							.end(function(examinationDeleteErr, examinationDeleteRes) {
								// Handle Examination error error
								if (examinationDeleteErr) done(examinationDeleteErr);

								// Set assertions
								(examinationDeleteRes.body._id).should.equal(examinationSaveRes.body._id);

								// Call the assertion callback
								done();
							});
					});
			});
	});

	it('should not be able to delete Examination instance if not signed in', function(done) {
		// Set Examination user 
		examination.user = user;

		// Create new Examination model instance
		var examinationObj = new Examination(examination);

		// Save the Examination
		examinationObj.save(function() {
			// Try deleting Examination
			request(app).delete('/examinations/' + examinationObj._id)
			.expect(401)
			.end(function(examinationDeleteErr, examinationDeleteRes) {
				// Set message assertion
				(examinationDeleteRes.body.message).should.match('User is not logged in');

				// Handle Examination error error
				done(examinationDeleteErr);
			});

		});
	});

	afterEach(function(done) {
		User.remove().exec();
		Examination.remove().exec();
		done();
	});
});