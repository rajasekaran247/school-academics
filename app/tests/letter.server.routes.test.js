'use strict';

var should = require('should'),
	request = require('supertest'),
	app = require('../../server'),
	mongoose = require('mongoose'),
	User = mongoose.model('User'),
	Letter = mongoose.model('Letter'),
	agent = request.agent(app);

/**
 * Globals
 */
var credentials, user, letter;

/**
 * Letter routes tests
 */
describe('Letter CRUD tests', function() {
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

		// Save a user to the test db and create new Letter
		user.save(function() {
			letter = {
				name: 'Letter Name'
			};

			done();
		});
	});

	it('should be able to save Letter instance if logged in', function(done) {
		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Letter
				agent.post('/letters')
					.send(letter)
					.expect(200)
					.end(function(letterSaveErr, letterSaveRes) {
						// Handle Letter save error
						if (letterSaveErr) done(letterSaveErr);

						// Get a list of Letters
						agent.get('/letters')
							.end(function(lettersGetErr, lettersGetRes) {
								// Handle Letter save error
								if (lettersGetErr) done(lettersGetErr);

								// Get Letters list
								var letters = lettersGetRes.body;

								// Set assertions
								(letters[0].user._id).should.equal(userId);
								(letters[0].name).should.match('Letter Name');

								// Call the assertion callback
								done();
							});
					});
			});
	});

	it('should not be able to save Letter instance if not logged in', function(done) {
		agent.post('/letters')
			.send(letter)
			.expect(401)
			.end(function(letterSaveErr, letterSaveRes) {
				// Call the assertion callback
				done(letterSaveErr);
			});
	});

	it('should not be able to save Letter instance if no name is provided', function(done) {
		// Invalidate name field
		letter.name = '';

		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Letter
				agent.post('/letters')
					.send(letter)
					.expect(400)
					.end(function(letterSaveErr, letterSaveRes) {
						// Set message assertion
						(letterSaveRes.body.message).should.match('Please fill Letter name');
						
						// Handle Letter save error
						done(letterSaveErr);
					});
			});
	});

	it('should be able to update Letter instance if signed in', function(done) {
		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Letter
				agent.post('/letters')
					.send(letter)
					.expect(200)
					.end(function(letterSaveErr, letterSaveRes) {
						// Handle Letter save error
						if (letterSaveErr) done(letterSaveErr);

						// Update Letter name
						letter.name = 'WHY YOU GOTTA BE SO MEAN?';

						// Update existing Letter
						agent.put('/letters/' + letterSaveRes.body._id)
							.send(letter)
							.expect(200)
							.end(function(letterUpdateErr, letterUpdateRes) {
								// Handle Letter update error
								if (letterUpdateErr) done(letterUpdateErr);

								// Set assertions
								(letterUpdateRes.body._id).should.equal(letterSaveRes.body._id);
								(letterUpdateRes.body.name).should.match('WHY YOU GOTTA BE SO MEAN?');

								// Call the assertion callback
								done();
							});
					});
			});
	});

	it('should be able to get a list of Letters if not signed in', function(done) {
		// Create new Letter model instance
		var letterObj = new Letter(letter);

		// Save the Letter
		letterObj.save(function() {
			// Request Letters
			request(app).get('/letters')
				.end(function(req, res) {
					// Set assertion
					res.body.should.be.an.Array.with.lengthOf(1);

					// Call the assertion callback
					done();
				});

		});
	});


	it('should be able to get a single Letter if not signed in', function(done) {
		// Create new Letter model instance
		var letterObj = new Letter(letter);

		// Save the Letter
		letterObj.save(function() {
			request(app).get('/letters/' + letterObj._id)
				.end(function(req, res) {
					// Set assertion
					res.body.should.be.an.Object.with.property('name', letter.name);

					// Call the assertion callback
					done();
				});
		});
	});

	it('should be able to delete Letter instance if signed in', function(done) {
		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Letter
				agent.post('/letters')
					.send(letter)
					.expect(200)
					.end(function(letterSaveErr, letterSaveRes) {
						// Handle Letter save error
						if (letterSaveErr) done(letterSaveErr);

						// Delete existing Letter
						agent.delete('/letters/' + letterSaveRes.body._id)
							.send(letter)
							.expect(200)
							.end(function(letterDeleteErr, letterDeleteRes) {
								// Handle Letter error error
								if (letterDeleteErr) done(letterDeleteErr);

								// Set assertions
								(letterDeleteRes.body._id).should.equal(letterSaveRes.body._id);

								// Call the assertion callback
								done();
							});
					});
			});
	});

	it('should not be able to delete Letter instance if not signed in', function(done) {
		// Set Letter user 
		letter.user = user;

		// Create new Letter model instance
		var letterObj = new Letter(letter);

		// Save the Letter
		letterObj.save(function() {
			// Try deleting Letter
			request(app).delete('/letters/' + letterObj._id)
			.expect(401)
			.end(function(letterDeleteErr, letterDeleteRes) {
				// Set message assertion
				(letterDeleteRes.body.message).should.match('User is not logged in');

				// Handle Letter error error
				done(letterDeleteErr);
			});

		});
	});

	afterEach(function(done) {
		User.remove().exec();
		Letter.remove().exec();
		done();
	});
});