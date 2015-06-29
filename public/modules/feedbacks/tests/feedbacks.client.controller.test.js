'use strict';

(function() {
	// Feedbacks Controller Spec
	describe('Feedbacks Controller Tests', function() {
		// Initialize global variables
		var FeedbacksController,
		scope,
		$httpBackend,
		$stateParams,
		$location;

		// The $resource service augments the response object with methods for updating and deleting the resource.
		// If we were to use the standard toEqual matcher, our tests would fail because the test values would not match
		// the responses exactly. To solve the problem, we define a new toEqualData Jasmine matcher.
		// When the toEqualData matcher compares two objects, it takes only object properties into
		// account and ignores methods.
		beforeEach(function() {
			jasmine.addMatchers({
				toEqualData: function(util, customEqualityTesters) {
					return {
						compare: function(actual, expected) {
							return {
								pass: angular.equals(actual, expected)
							};
						}
					};
				}
			});
		});

		// Then we can start by loading the main application module
		beforeEach(module(ApplicationConfiguration.applicationModuleName));

		// The injector ignores leading and trailing underscores here (i.e. _$httpBackend_).
		// This allows us to inject a service but then attach it to a variable
		// with the same name as the service.
		beforeEach(inject(function($controller, $rootScope, _$location_, _$stateParams_, _$httpBackend_) {
			// Set a new global scope
			scope = $rootScope.$new();

			// Point global variables to injected services
			$stateParams = _$stateParams_;
			$httpBackend = _$httpBackend_;
			$location = _$location_;

			// Initialize the Feedbacks controller.
			FeedbacksController = $controller('FeedbacksController', {
				$scope: scope
			});
		}));

		it('$scope.find() should create an array with at least one Feedback object fetched from XHR', inject(function(Feedbacks) {
			// Create sample Feedback using the Feedbacks service
			var sampleFeedback = new Feedbacks({
				name: 'New Feedback'
			});

			// Create a sample Feedbacks array that includes the new Feedback
			var sampleFeedbacks = [sampleFeedback];

			// Set GET response
			$httpBackend.expectGET('feedbacks').respond(sampleFeedbacks);

			// Run controller functionality
			scope.find();
			$httpBackend.flush();

			// Test scope value
			expect(scope.feedbacks).toEqualData(sampleFeedbacks);
		}));

		it('$scope.findOne() should create an array with one Feedback object fetched from XHR using a feedbackId URL parameter', inject(function(Feedbacks) {
			// Define a sample Feedback object
			var sampleFeedback = new Feedbacks({
				name: 'New Feedback'
			});

			// Set the URL parameter
			$stateParams.feedbackId = '525a8422f6d0f87f0e407a33';

			// Set GET response
			$httpBackend.expectGET(/feedbacks\/([0-9a-fA-F]{24})$/).respond(sampleFeedback);

			// Run controller functionality
			scope.findOne();
			$httpBackend.flush();

			// Test scope value
			expect(scope.feedback).toEqualData(sampleFeedback);
		}));

		it('$scope.create() with valid form data should send a POST request with the form input values and then locate to new object URL', inject(function(Feedbacks) {
			// Create a sample Feedback object
			var sampleFeedbackPostData = new Feedbacks({
				name: 'New Feedback'
			});

			// Create a sample Feedback response
			var sampleFeedbackResponse = new Feedbacks({
				_id: '525cf20451979dea2c000001',
				name: 'New Feedback'
			});

			// Fixture mock form input values
			scope.name = 'New Feedback';

			// Set POST response
			$httpBackend.expectPOST('feedbacks', sampleFeedbackPostData).respond(sampleFeedbackResponse);

			// Run controller functionality
			scope.create();
			$httpBackend.flush();

			// Test form inputs are reset
			expect(scope.name).toEqual('');

			// Test URL redirection after the Feedback was created
			expect($location.path()).toBe('/feedbacks/' + sampleFeedbackResponse._id);
		}));

		it('$scope.update() should update a valid Feedback', inject(function(Feedbacks) {
			// Define a sample Feedback put data
			var sampleFeedbackPutData = new Feedbacks({
				_id: '525cf20451979dea2c000001',
				name: 'New Feedback'
			});

			// Mock Feedback in scope
			scope.feedback = sampleFeedbackPutData;

			// Set PUT response
			$httpBackend.expectPUT(/feedbacks\/([0-9a-fA-F]{24})$/).respond();

			// Run controller functionality
			scope.update();
			$httpBackend.flush();

			// Test URL location to new object
			expect($location.path()).toBe('/feedbacks/' + sampleFeedbackPutData._id);
		}));

		it('$scope.remove() should send a DELETE request with a valid feedbackId and remove the Feedback from the scope', inject(function(Feedbacks) {
			// Create new Feedback object
			var sampleFeedback = new Feedbacks({
				_id: '525a8422f6d0f87f0e407a33'
			});

			// Create new Feedbacks array and include the Feedback
			scope.feedbacks = [sampleFeedback];

			// Set expected DELETE response
			$httpBackend.expectDELETE(/feedbacks\/([0-9a-fA-F]{24})$/).respond(204);

			// Run controller functionality
			scope.remove(sampleFeedback);
			$httpBackend.flush();

			// Test array after successful delete
			expect(scope.feedbacks.length).toBe(0);
		}));
	});
}());