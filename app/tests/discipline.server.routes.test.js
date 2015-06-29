'use strict';

var should = require('should'),
	request = require('supertest'),
	app = require('../../server'),
	mongoose = require('mongoose'),
	User = mongoose.model('User'),
	Discipline = mongoose.model('Discipline'),
	agent = request.agent(app);

/**
 * Globals
 */
var credentials, user, discipline;

/**
 * Discipline routes tests
 */
describe('Discipline CRUD tests', function() {
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

		// Save a user to the test db and create new Discipline
		user.save(function() {
			discipline = {
				name: 'Discipline Name'
			};

			done();
		});
	});

	it('should be able to save Discipline instance if logged in', function(done) {
		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Discipline
				agent.post('/disciplines')
					.send(discipline)
					.expect(200)
					.end(function(disciplineSaveErr, disciplineSaveRes) {
						// Handle Discipline save error
						if (disciplineSaveErr) done(disciplineSaveErr);

						// Get a list of Disciplines
						agent.get('/disciplines')
							.end(function(disciplinesGetErr, disciplinesGetRes) {
								// Handle Discipline save error
								if (disciplinesGetErr) done(disciplinesGetErr);

								// Get Disciplines list
								var disciplines = disciplinesGetRes.body;

								// Set assertions
								(disciplines[0].user._id).should.equal(userId);
								(disciplines[0].name).should.match('Discipline Name');

								// Call the assertion callback
								done();
							});
					});
			});
	});

	it('should not be able to save Discipline instance if not logged in', function(done) {
		agent.post('/disciplines')
			.send(discipline)
			.expect(401)
			.end(function(disciplineSaveErr, disciplineSaveRes) {
				// Call the assertion callback
				done(disciplineSaveErr);
			});
	});

	it('should not be able to save Discipline instance if no name is provided', function(done) {
		// Invalidate name field
		discipline.name = '';

		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Discipline
				agent.post('/disciplines')
					.send(discipline)
					.expect(400)
					.end(function(disciplineSaveErr, disciplineSaveRes) {
						// Set message assertion
						(disciplineSaveRes.body.message).should.match('Please fill Discipline name');
						
						// Handle Discipline save error
						done(disciplineSaveErr);
					});
			});
	});

	it('should be able to update Discipline instance if signed in', function(done) {
		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Discipline
				agent.post('/disciplines')
					.send(discipline)
					.expect(200)
					.end(function(disciplineSaveErr, disciplineSaveRes) {
						// Handle Discipline save error
						if (disciplineSaveErr) done(disciplineSaveErr);

						// Update Discipline name
						discipline.name = 'WHY YOU GOTTA BE SO MEAN?';

						// Update existing Discipline
						agent.put('/disciplines/' + disciplineSaveRes.body._id)
							.send(discipline)
							.expect(200)
							.end(function(disciplineUpdateErr, disciplineUpdateRes) {
								// Handle Discipline update error
								if (disciplineUpdateErr) done(disciplineUpdateErr);

								// Set assertions
								(disciplineUpdateRes.body._id).should.equal(disciplineSaveRes.body._id);
								(disciplineUpdateRes.body.name).should.match('WHY YOU GOTTA BE SO MEAN?');

								// Call the assertion callback
								done();
							});
					});
			});
	});

	it('should be able to get a list of Disciplines if not signed in', function(done) {
		// Create new Discipline model instance
		var disciplineObj = new Discipline(discipline);

		// Save the Discipline
		disciplineObj.save(function() {
			// Request Disciplines
			request(app).get('/disciplines')
				.end(function(req, res) {
					// Set assertion
					res.body.should.be.an.Array.with.lengthOf(1);

					// Call the assertion callback
					done();
				});

		});
	});


	it('should be able to get a single Discipline if not signed in', function(done) {
		// Create new Discipline model instance
		var disciplineObj = new Discipline(discipline);

		// Save the Discipline
		disciplineObj.save(function() {
			request(app).get('/disciplines/' + disciplineObj._id)
				.end(function(req, res) {
					// Set assertion
					res.body.should.be.an.Object.with.property('name', discipline.name);

					// Call the assertion callback
					done();
				});
		});
	});

	it('should be able to delete Discipline instance if signed in', function(done) {
		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Discipline
				agent.post('/disciplines')
					.send(discipline)
					.expect(200)
					.end(function(disciplineSaveErr, disciplineSaveRes) {
						// Handle Discipline save error
						if (disciplineSaveErr) done(disciplineSaveErr);

						// Delete existing Discipline
						agent.delete('/disciplines/' + disciplineSaveRes.body._id)
							.send(discipline)
							.expect(200)
							.end(function(disciplineDeleteErr, disciplineDeleteRes) {
								// Handle Discipline error error
								if (disciplineDeleteErr) done(disciplineDeleteErr);

								// Set assertions
								(disciplineDeleteRes.body._id).should.equal(disciplineSaveRes.body._id);

								// Call the assertion callback
								done();
							});
					});
			});
	});

	it('should not be able to delete Discipline instance if not signed in', function(done) {
		// Set Discipline user 
		discipline.user = user;

		// Create new Discipline model instance
		var disciplineObj = new Discipline(discipline);

		// Save the Discipline
		disciplineObj.save(function() {
			// Try deleting Discipline
			request(app).delete('/disciplines/' + disciplineObj._id)
			.expect(401)
			.end(function(disciplineDeleteErr, disciplineDeleteRes) {
				// Set message assertion
				(disciplineDeleteRes.body.message).should.match('User is not logged in');

				// Handle Discipline error error
				done(disciplineDeleteErr);
			});

		});
	});

	afterEach(function(done) {
		User.remove().exec();
		Discipline.remove().exec();
		done();
	});
});